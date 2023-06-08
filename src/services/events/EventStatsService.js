const moment = require("moment");
const { topK } = require("../../helpers/ListHelper");
const { getReadTickets } = require("../../repository/EventRepository");

const { groupBy } = require("../../helpers/ListHelper");

const { getFullName } = require("../../repository/UserRepository");

const { ATTENDEES_RELATION_NAME } = require("../../constants/dataConstants");

const { User } = require("../../data/model/User");

const { Events } = require("../../data/model/Events");

const { EventReport } = require("../../data/model/EventReport");

const {
    FILTER_TYPE_MONTH,
    FILTER_TYPE_YEAR
} = require("../../constants/events/eventStatsConstants");

const {
    dateFromString,
    monthNumberToString
} = require("../../helpers/DateHelper");

const {
    EVENT_TO_EVENT_STATE_RELATION_NAME,
    ORGANIZER_RELATION_NAME
} = require("../../constants/dataConstants");

const { EventState } = require("../../data/model/EventState");

const {
    Sequelize,
    Op
} = require("sequelize");

const { WRONG_DATE_FORMAT_ERR_LBL } = require("../../constants/events/eventsConstants");

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
        const eventCount = eventCounts.filter(e => {
            return moment(e.date, 'DD/MM/YYYY').isSame(startMoment, 'day');
        });

        const momentDate = startMoment.format('DD/MM/YYYY');

        resultInDays.push({
            moment: momentDate,

            count: eventCount ? parseInt(eventCount.length) : 0
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

const getStatsData = async (req, res, statsCallback) => {
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

    const eventCounts = await statsCallback(startDate, endDate);

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

const getEventsDatesStats = async (req, res) => {
    const eventCallback = async (startDate, endDate) => {
        return await findAll(Events,
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
    }

    return getStatsData(req, res, eventCallback);
}

const getReportsStats = async (req, res) => {
    const eventCallback = async (startDate, endDate) => {
        return await findAll(EventReport,
            {
                'createdAt': {
                    [Op.between]: [startDate, endDate]
                }
            },
            [
            ],
            [],
            [
                ['createdAt', 'date'],
                [
                    Sequelize.fn('count', Sequelize.col('createdAt')),
                    'count'
                ]
            ],
            [
                'createdAt'
            ],
            true
        );
    }

    return getStatsData(req, res, eventCallback);
}

const getTop5OrganizersByAttendances = async (req, res) => {
    const events = await findAll(Events,
        {

        },
        [
            {
                model: User,
                attributes:  [
                    "first_name",
                    "last_name"
                ],
                as: ORGANIZER_RELATION_NAME
            },
            {
                model: User,
                attributes: ["id"],
                as: ATTENDEES_RELATION_NAME
            },
        ],
        [],
        [
        ],
        [
        ],
        false
    );

    if (events.error) {
        return setUnexpectedErrorResponse(events.error, res);
    }

    const eventsByOrganizers = groupBy(events, event => getFullName(event.organizer));

    const attendancesByOrganizers = eventsByOrganizers.map(event => {
        return {
            organizer: event.name,

            tickets: event.value.length > 1
                ? event.value.reduce((e1, e2) => getReadTickets(e1) + getReadTickets(e2))
                : getReadTickets(event.value[0])
        }
    });

    const resultSortingFn = (a, b) => a.tickets - b.tickets;

    const top5 = topK(attendancesByOrganizers, resultSortingFn, 5);

    top5.sort(resultSortingFn);

    const result = {
        organizers: top5
    };

    return setOkResponse(OK_LBL, res, result);
}

module.exports = {
    getEventsDatesStats, getEventStatusStats, getReportsStats,
    getTop5OrganizersByAttendances
};
