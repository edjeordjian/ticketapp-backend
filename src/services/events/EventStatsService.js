const moment = require("moment");

const { getEventAttendancesStats } = require("../../repository/EventRepository");

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
    ORGANIZER_RELATION_NAME,
    EVENTS_REPORT_RELATION_NAME
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
        startDate,
        endDate
    } = req.query;

    const start = dateFromString(startDate);

    const end = dateFromString(endDate, true);

    if (start == "Invalid Date" || end == "Invalid Date") {
        return setErrorResponse(WRONG_DATE_FORMAT_ERR_LBL, res);
    }

    const eventsResult = await findAll(Events,
        {
            date: {
                [Op.between]: [start, end]
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
        labels: responseData.map(o => o.status),

        data: responseData.map(o => o.number)
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
        startDate,
        endDate,
        filter
    } = req.query;

    const start = dateFromString(startDate);

    const end = dateFromString(endDate, true);

    if (start == "Invalid Date" || end == "Invalid Date") {
        return setErrorResponse(WRONG_DATE_FORMAT_ERR_LBL, res);
    }

    const eventCounts = await statsCallback(start, end);

    if (eventCounts.error) {
        return setUnexpectedErrorResponse(eventCounts.error, res);
    }

    let stats = getEventsDatesStatsInDays(start, end, eventCounts);

    if (filter === FILTER_TYPE_MONTH) {
        stats = getEventsDatesStatsInMonths(stats);
    } else if (filter === FILTER_TYPE_YEAR) {
        stats = getEventsDatesStatsInYears(stats);
    }

    const result = {
        labels: stats.map(o => o.moment),

        data: stats.map(o => o.count)
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

const getEventsAttendancesStats = async (req, res) => {
    const eventCallback = async (startDate, endDate) => {
        const result =  await findAll(Events,
            {
                'date': {
                    [Op.between]: [startDate, endDate]
                }
            },
            [
                {
                    model: User,
                    attributes: ["id", "first_name", "last_name", "email"],
                    as: ATTENDEES_RELATION_NAME
                }
            ],
        );

        if (result.error) {
            return result;
        }

        const mappedResult = result.map(e => getEventAttendancesStats(e, startDate, endDate));

        return mappedResult.length !== 0
            ? mappedResult.reduce((list1, list2) => list1.concat(list2))
            : 0;
    }

    return getStatsData(req, res, eventCallback);
}

const getTop5OrganizersByAttendances = async (req, res) => {
    const {
        startDate,
        endDate
    } = req.query;

    const start = dateFromString(startDate);

    const end = dateFromString(endDate, true);

    if (start == "Invalid Date" || end == "Invalid Date") {
        return setErrorResponse(WRONG_DATE_FORMAT_ERR_LBL, res);
    }

    const events = await findAll(Events,
        {
            'date': {
                [Op.between]: [start, end]
            }
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
        {
            exclude: []
        },
        [
        ],
        false
    );

    if (events.error) {
        return setUnexpectedErrorResponse(events.error, res);
    }

    const eventsByOrganizers = groupBy(events, event => getFullName(event.organizer));

    const attendancesByOrganizers = eventsByOrganizers.map(event => {
        const readTickets = event.value.length > 1
            ? event.value.reduce((e1, e2) => getReadTickets(e1) + getReadTickets(e2))
            : getReadTickets(event.value[0]);

        const totalTickets = event.value.length > 1
            ? event.value.reduce((e1, e2) => e1.capacity + e2.capacity)
            : event.value[0].capacity;

        const percentage = parseInt(readTickets / totalTickets * 100);

        return {
            organizer: event.name,

            tickets: readTickets,

            percentage: `${percentage}%`
        }
    });

    const resultSortingFn = (a, b) => a.tickets - b.tickets;

    const top5 = topK(attendancesByOrganizers, resultSortingFn, 5).filter(organizer => {
        return organizer.percentage > "80%"
    });

    top5.sort(resultSortingFn);

    const result = {
        organizers: top5
    };

    return setOkResponse(OK_LBL, res, result);
}

const getHistoricStats = async (req, res) => {
    const userCount = await User.count();
    const reportCount = await EventReport.count();
    const consumerCount = await User.count({
        where: {is_consumer: true}
    })
    const organizerCount = await User.count({
        where: {is_organizer: true}
    })
    const eventCount = await Events.count();
    const activeEvents = await Events.count({
        where: {state_id: 2}
    });
    const result = {
        userCount: userCount,
        consumerCount: consumerCount,
        organizerCount: organizerCount,
        reportCount: reportCount,
        eventCount: eventCount,
        activeEventCount: activeEvents
    }


    setOkResponse(OK_LBL, res,result)
}

const getTop5ReportedOrganizers = async (req, res) => {
    const {
        startDate,
        endDate
    } = req.query;

    const start = dateFromString(startDate);

    const end = dateFromString(endDate, true);

    if (start == "Invalid Date" || end == "Invalid Date") {
        return setErrorResponse(WRONG_DATE_FORMAT_ERR_LBL, res);
    }

    const reports = await findAll(EventReport,
        {
            'createdAt': {
                [Op.between]: [start, end]
            }
        },
        [
            {
                model: Events,
                as: EVENTS_REPORT_RELATION_NAME,
                include: {
                    model: User,
                    as: ORGANIZER_RELATION_NAME
                }
            },
        ]
    );

    if (reports.error) {
        return setUnexpectedErrorResponse(reports.error, res);
    }

    const responseByOrganizator = groupBy(reports, report => {
        return getFullName(report.events_reports.organizer)
    }).map(data => {
        return {
            name: data.name,

            count: data.value.length
        }
    });

    const resultSortingFn = (a, b) => a.count - b.count;

    const top5 = topK(responseByOrganizator, resultSortingFn, 5);

    top5.sort(resultSortingFn);

    const result = {
        labels: top5.length !== 0 ? top5.map(o => o.name) : [],

        data:  top5.length !== 0 ? top5.map(o => o.count) : []
    }

    return setOkResponse(OK_LBL, res, result);
}

module.exports = {
    getEventsDatesStats, getEventStatusStats, getReportsStats,
    getTop5OrganizersByAttendances, getEventsAttendancesStats, getHistoricStats,
    getTop5ReportedOrganizers
};
