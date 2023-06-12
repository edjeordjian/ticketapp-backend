const { groupBy } = require("../helpers/ListHelper");

const { EventCalendarSchedule } = require("../data/model/EventCalendarSchedule");

const { getFullName } = require("./UserRepository");

const { getTimeStringFrom } = require("../helpers/DateHelper");

const { SUSPENDED_STATUS_LBL } = require("../constants/events/EventStatusConstants");

const { EventReportCategory } = require("../data/model/EventReportCategory");

const {
    getReportDataForEvent,
    getLastReportDate
} = require("./ReportRepository");

const {
    IS_PRODUCTION,
    REPORTER_RELATION_NAME,
    EVENT_TO_EVENT_STATE_RELATION_NAME,
    EVENTS_REPORT_RELATION_NAME,
    ATTENDEES_RELATION_NAME,
    ORGANIZER_RELATION_NAME
} = require("../constants/dataConstants");

const { EventReport } = require("../data/model/EventReport");

const { EventState } = require("../data/model/EventState");

const { FAQ } = require("../data/model/FAQ");

const { User } = require("../data/model/User");

const { EventTypes } = require("../data/model/EventTypes");

const { Speakers } = require("../data/model/Speakers");

const {
    timeToString,
    dateToString
} = require("../helpers/DateHelper");

const eventReportsInclude = {
    model: EventReport,
    attributes: ["text", "createdAt"],
    as: EVENTS_REPORT_RELATION_NAME,
    include: [
        {
            model: User,
            as: REPORTER_RELATION_NAME
        },
        {
            model: EventReportCategory
        }
    ]
};

const eventIncludes = [
    {
        model: Speakers,
        attributes: ["start", "end", "title"]
    },
    {
        model: EventTypes,
        attributes: ["id", "name"]
    },
    {
        model: User,
        attributes: ["first_name", "last_name"],
        as: ORGANIZER_RELATION_NAME
    },
    {
        model: User,
        attributes: ["id"],
        as: ATTENDEES_RELATION_NAME
    },
    {
        model: FAQ,
        attributes: ["question", "answer"],
    },
    {
        model: EventState,
        attributes: ["id", "name"],
        as: EVENT_TO_EVENT_STATE_RELATION_NAME
    },
    eventReportsInclude,
    {
        model: EventCalendarSchedule
    }
];

const getEventAttendancesStats = (e, from, to) => {
    let attendances = e.attendees
                         .filter(attendee => attendee.attendances.attended);

    if (attendances.length > 0) {
        if (from && to){
            const groupedAttendances = groupBy(attendances, (attendance) => {
                return dateToString(attendance.attendances.updatedAt);
            })

            return groupedAttendances.map(attendance => {
                return {
                    date: attendance.name,
                    count: attendance.value.length
                }
            });
        }

        const stats = attendances.map(attendance => {
            let updateTime = attendance.attendances.updatedAt;

            //if (IS_PRODUCTION) {
            //    updateTime = new Date(new Date(updateTime).setHours(updateTime.getHours() - 3));
            //}

            return {
                name: getFullName(attendance),

                time: getTimeStringFrom(updateTime)
            }
        });

        stats.sort((a, b) => a.time > b.time ? 1 :-1);

        return stats;
    }

    return [];
}

const getEventAttendancesRange = (e) => {
    const attendances = e.attendees
        .filter(attendee => attendee.attendances.attended);

    if (attendances.length > 0) {
        const result =  attendances.map(attendance => {
            let updateTime = attendance.attendances.updatedAt;

            //if (IS_PRODUCTION) {
            //    updateTime = new Date(new Date(updateTime).setHours(updateTime.getHours() - 3));
            //}

            return getTimeStringFrom(updateTime);
        });

        result.sort();

        return result;
    }

    return [];
}

const getTicket = (e,
                   userId) => {
    const attendances = e.attendees
        .filter(attendee => attendee.id === userId);

    if (attendances.length > 0) {
        const attendance = attendances[0].attendances;

        return {
            id: attendance.hash_code,
            wasUsed: attendance.attended
        }
    }

    return {};
}

const wasReportedByUser = (e, userId) => {
    if (! e.events_reports) {
        return false;
    }

    const userReports = e.events_reports.filter(report => {
        return report.reporter.id === userId
    });

    return userReports.length !== 0;
}

const getTotalTickets = (evt) => {
    return evt.attendees
        .map(e => e.attendances)
        .length;
}

const getReadTickets = (evt) => {
    return evt.attendees
        .map(e => e.attendances)
        .filter(e => e.attended)
        .length;
}

const getSerializedEvent = async (e,
                                  userId = null,
                                  withReports = false,
                                  with_read_tickets = false) => {
    let read_tickets = null;

    if (with_read_tickets) {
        read_tickets = getReadTickets(e);
    }

    const pictures = [];

    if (e.wallpaper_url) {
        pictures.push(e.wallpaper_url);
    }

    if (e.picture1_url) {
        pictures.push(e.picture1_url);
    }

    if (e.picture2_url) {
        pictures.push(e.picture2_url);
    }

    if (e.picture3_url) {
        pictures.push(e.picture3_url);
    }

    if (e.picture4_url) {
        pictures.push(e.picture4_url);
    }

    const owner = await e.getOrganizer();

    let ticket = {}

    if (userId) {
        ticket = getTicket(e, userId);
    }

    const result = {
        id: e.id,

        name: e.name,

        description: e.description,

        capacity: e.capacity,

        date: dateToString(e.date),

        time: timeToString(e.time),

        address: e.address,

        latitude: e.latitude,

        longitude: e.longitude,

        pictures: pictures,

        types_ids: e.event_types.map(type => type.id),

        types_names: e.event_types.map(type => type.name),

        isBlocked: e.state ? e.state.name === SUSPENDED_STATUS_LBL: false,

        organizerName: `${owner.first_name} ${owner.last_name}`,

        agenda: e.speakers ? e.speakers.map(speaker => {
            return {
                "start": speaker.start,

                "end": speaker.end,

                "title": speaker.title
            }
        }) : [],

        faq: e.FAQs ? e.FAQs.map(faq => {
            return {
                "question": faq.question,
                "answer": faq.answer
            }
        }) : [],

        ticket: ticket,

        state: e.state ?
            {
            "id": e.state.id,

            "name": e.state.name
            }
            :
            {}
    }

    if (read_tickets !== null) {
        const sold_tickets = e.total_capacity - e.capacity;

        const percentage = sold_tickets !== 0 ? Math.ceil(read_tickets / sold_tickets * 100) : 0;

        result.ticket_percentage = 100 - percentage;

        result.ticket_fraction = percentage / 100;

        result.ticket_to_read = sold_tickets - read_tickets;
    }

    if (userId) {
        result.wasReported = wasReportedByUser(e, userId);

        result.is_favourite = e.FavouritedByUsers ?
            e.FavouritedByUsers.filter(fav => fav.id === userId).length !== 0 :
            false;
    } else {
        result.is_favourite = false;
    }

    if (withReports) {
        if (! e.reports) {
            e.reports = e.events_reports;
        }

        result.reports = e.reports.map(report => {
            return getReportDataForEvent(report, e);
        });

        result.reportsNumber = result.reports.length;

        if (result.reportsNumber > 0) {
            result.lastReportDate = getLastReportDate(result.reports);
        }
    }

    return result;
};

module.exports = {
    getSerializedEvent, getTicket, eventIncludes, getEventAttendancesStats,
    getEventAttendancesRange, getReadTickets, getTotalTickets
};
