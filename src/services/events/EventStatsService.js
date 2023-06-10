const moment = require("moment");
const { monthNumberToString, dateToMomentFormat } = require("../../helpers/DateHelper");

const {
    FILTER_TYPE_MONTH,
    FILTER_TYPE_YEAR
} = require("../../constants/events/eventStatsConstants");

const { dateFromString } = require("../../helpers/DateHelper");

const { EVENT_TO_EVENT_STATE_RELATION_NAME } = require("../../constants/dataConstants");

const { EventState } = require("../../data/model/EventState");

const {
    Sequelize,
    Op,
} = require("sequelize");


const { WRONG_DATE_FORMAT_ERR_LBL } = require("../../constants/events/eventsConstants");

const { Events } = require("../../data/model/Events");

const {
    DRAFT_STATUS_LBL,
    SUSPENDED_STATUS_LBL,
    FINISHED_STATUS_LBL,
    PUBLISHED_STATUS_LBL,
    CANCELLED_STATUS_LBL
} = require("../../constants/events/EventStatusConstants");

const {
    findAll
} = require("../../helpers/QueryHelper");

const {
    setOkResponse,
    setErrorResponse,
    setUnexpectedErrorResponse
} = require("../../helpers/ResponseHelper");

const { OK_LBL } = require("../../constants/messages");
const { Attendances } = require("../../data/model/Attendances");

const getEventStatusStats = async (req, res) => {
    const {
        start,
        end
    } = req.query;

    const startDate = dateFromString(start);

    const endDate = dateFromString(end, true);

    if (startDate == "Invalid Date" || endDate == "Invalid Date") {
        return setErrorResponse(WRONG_DATE_FORMAT_ERR_LBL, res);
    }

    const eventsResult = await findAll(Events,
        {
            date: {
                [Op.between]: [startDate, endDate]
            }
        },
        {
            model: EventState,
            attributes: ["id", "name"],
            as: EVENT_TO_EVENT_STATE_RELATION_NAME
        });

    if (eventsResult.error) {
        return setUnexpectedErrorResponse(eventsResult.error, res);
    }

    const statusNames = [
        DRAFT_STATUS_LBL,
        SUSPENDED_STATUS_LBL,
        FINISHED_STATUS_LBL,
        PUBLISHED_STATUS_LBL,
        CANCELLED_STATUS_LBL
    ];

    const responseData = statusNames.map(status => {
        return {
            number: eventsResult.filter(event => event.state.name === status)
                                .length,

            status: status
        };
    });

    const response = {
        stats: responseData
    }

    return setOkResponse(OK_LBL, res, response);
}

const getEventsDatesStatsInDays = (startDate, endDate, eventCounts) => {
    const startMoment = moment(startDate);

    const endMoment = moment(endDate);

    const resultInDays = []

    while (startMoment.isSameOrBefore(endMoment, 'day')) {
        const momentDate = startMoment.format('DD/MM/YYYY');

        const eventCount = eventCounts.find(e => {
            return moment(e.date).format('DD/MM/YYYY') === momentDate
        });

        resultInDays.push({
            moment: momentDate,

            count: eventCount ? parseInt(eventCount.count) : 0
        });

        startMoment.add(1, 'day');
    }

    return resultInDays;
}

const getEventsDatesStatsInMonths = (resultInDays) => {
    const resultByMonthsAux = {
        "01": 0, "02": 0, "03": 0, "04": 0,
        "05": 0, "06": 0, "07": 0, "08": 0,
        "09": 0, "10": 0, "11": 0, "12": 0
    };

    resultInDays.forEach(day => {
        const month = day.moment.split("/")[1];

        resultByMonthsAux[month] += day.count;
    });

    const resultByMonths =  Object.entries(resultByMonthsAux)
        .map(([month, count]) => ({
            moment: monthNumberToString(month),

            count: count
        }));

    // Reordering october
    resultByMonths.push(resultByMonths.shift());

    // Reordering november
    resultByMonths.push(resultByMonths.shift());

    // Reordering december
    resultByMonths.push(resultByMonths.shift());

    return resultByMonths;
}

const getEventsDatesStatsInYears = (resultInDays) => {
    const resultsByYear = {};

    resultInDays.forEach(day => {
        const year = day.moment.split("/")[2];

        resultsByYear[year] = resultsByYear[year]
            ? resultsByYear[year] + day.count
            : day.count;
    });

    return Object.entries(resultsByYear)
        .map(([year, count]) => ({
            moment: year,

            count: count
        }));
}

const getEventsDatesStats = async (req, res) => {
    const {
        start,
        end,
        filter
    } = req.query;

    const startDate = dateFromString(start);

    const endDate = dateFromString(end, true);

    if (startDate == "Invalid Date" || endDate == "Invalid Date") {
        return setErrorResponse(WRONG_DATE_FORMAT_ERR_LBL, res);
    }

    const eventCounts = await findAll(Events,
        {
            date: {
                [Op.between]: [startDate, endDate]
            }
        },
        [],
        [],
        [
            'date',
            [
                Sequelize.fn('count', Sequelize.col('date')),
                'count'
            ]
        ],
        [
            'date'
        ],
        true
    );

    if (eventCounts.error) {
        return setUnexpectedErrorResponse(eventCounts.error, res);
    }

    const resultInDays = getEventsDatesStatsInDays(startDate, endDate, eventCounts);

    const result = {
        stats: resultInDays
    }

    if (filter === FILTER_TYPE_MONTH) {
       result.stats = getEventsDatesStatsInMonths(resultInDays);
    } else if (filter === FILTER_TYPE_YEAR) {
        result.stats = getEventsDatesStatsInYears(resultInDays);
    }

    return setOkResponse(OK_LBL, res, result);
}

const getGeneralAttendancesStats = async (req, res) => {
    const { fromDay, toDay, fromYear, toYear, fromMonth, toMonth } = req.query;
    let result;
    let between;
    let groupCondition;
    try {
        if(fromDay && toDay) {
            groupCondition = Sequelize.literal('DATE("updatedAt")');
            groupColumn = [groupCondition,'date']
        } else if (fromMonth && toMonth) {
            groupCondition = Sequelize.literal('EXTRACT(MONTH FROM "updatedAt")');
            groupColumn  =[groupCondition, 'date'];
        } else if (fromYear && toYear) {
            groupCondition = Sequelize.literal('EXTRACT(YEAR FROM "updatedAt")');
            groupColumn  = [groupCondition, 'date'];
        }
        
        result = await Attendances.findAll({
            attributes: [
                groupColumn,
                [Sequelize.fn('COUNT', Sequelize.col('*')), 'count']
            ],
            where: {
                attended: true
            },
            group: groupCondition
            });
    
            
    } catch (error) {
        console.error('Error:', error);
        return setErrorResponse(error,res);
    }
    let labels = result.map(item => item.dataValues.date);
    const data = result.map(item => item.dataValues.count);
    if (fromMonth && toMonth){
        labels = labels.map(month => monthNumberToString(month));
    }
  
    setOkResponse(OK_LBL, res, {labels:labels, data: data});
  };


module.exports = {
    getEventsDatesStats, getEventStatusStats,getGeneralAttendancesStats
};
