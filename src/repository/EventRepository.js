const { getTimeStringFrom } = require("../helpers/DateHelper");

const { SUSPENDED_STATUS_LBL } = require("../constants/events/EventStatusConstants");
const { getStateId } = require("../services/events/EventStateService");
const { getLastReportDate } = require("./ReportRepository");
const { EventReportCategory } = require("../data/model/EventReportCategory");
const { getReportDataForEvent } = require("./ReportRepository");
const { REPORTER_RELATION_NAME } = require("../constants/dataConstants");
const { EVENTS_REPORT_RELATION_NAME } = require("../constants/dataConstants");
const { REPORTS_RELATION_NAME } = require("../constants/dataConstants");
const { EventReport } = require("../data/model/EventReport");
const { EVENT_TO_EVENT_STATE_RELATION_NAME } = require("../constants/dataConstants");
const { EventState } = require("../data/model/EventState");
const { FAQ } = require("../data/model/FAQ");

const { ATTENDEES_RELATION_NAME } = require("../constants/dataConstants");

const { ORGANIZER_RELATION_NAME } = require("../constants/dataConstants");

const { User } = require("../data/model/User");

const { EventTypes } = require("../data/model/EventTypes");

const { Speakers } = require("../data/model/Speakers");

const { timeToString } = require("../helpers/DateHelper");

const { dateToString } = require("../helpers/DateHelper");

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
    {
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
    }
];

const getEventAttendancesStats = (e) => {
    const attendances = e.attendees
                         .filter(attendee => attendee.attendances.attended);

    if (attendances.length > 0) {
        return attendances.map(attendance => {
            return {
                email: attendance.email,
                time: getTimeStringFrom(attendance.attendances.updatedAt)
            }
        })
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

const getSerializedEvent = async (e,
                                  userId = null,
                                  withReports = false) => {
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

    if (userId) {
        result.wasReported = wasReportedByUser(e, userId);
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
    getSerializedEvent, getTicket, eventIncludes, getEventAttendancesStats
};
