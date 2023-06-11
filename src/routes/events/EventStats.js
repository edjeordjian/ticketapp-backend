const express = require("express");

const Logger = require("../../helpers/Logger");

const { getTop5ReportedOrganizers } = require("../../services/events/EventStatsService");

const {
    EVENTS_DATES_STATS_URL,
    EVENT_STATUS_STATS_URL,
    ATTENDANCES_STATS_URL,
    REPORTS_STATS_URL,
    TOP_ORGANIZERS_URL,
    ATTENDANCES_TOTAL_STATS_URL,
    HISTORIC_STATS_URL,
    TOP_REPORTED_ORGANIZRS_URL,
    ATTENDANCES_RANGE_URL
} = require("../../constants/URLs");

const { userIsStaff } = require("../../services/users/UserService");

const {
    isAllowedMiddleware,
    administratorMiddleware
} = require("../authentication/Middleware");

const {
    getReportsStats,
    getEventStatusStats,
    getEventsDatesStats,
    getTop5OrganizersByAttendances,
    getEventsAttendancesStats,
    getHistoricStats
} = require("../../services/events/EventStatsService");

const {
    getAttendancesStats,
    getAttendancesRange
} = require("../../services/events/EventService");

const router = express.Router();

router.get(ATTENDANCES_STATS_URL, async (req, res, next) => {
    await isAllowedMiddleware(req, res, next, userIsStaff);
}, async (req, res) => {
    Logger.request(`GET ${ATTENDANCES_STATS_URL}`);

    await getAttendancesStats(req, res);
});

router.get(ATTENDANCES_RANGE_URL, async (req, res, next) => {
    await isAllowedMiddleware(req, res, next, userIsStaff);
}, async (req, res) => {
    Logger.request(`GET ${ATTENDANCES_RANGE_URL}`);
    await getAttendancesRange(req, res);
});

router.get(EVENT_STATUS_STATS_URL, async (req, res, next) => {
    await administratorMiddleware(req, res, next)
}, async (req, res) => {
    Logger.request(`GET ${EVENT_STATUS_STATS_URL}`);

    await getEventStatusStats(req, res);
});

router.get(EVENTS_DATES_STATS_URL, async (req, res, next) => {
    await administratorMiddleware(req, res, next)
}, async (req, res) => {
    Logger.request(`GET ${EVENTS_DATES_STATS_URL}`);

    await getEventsDatesStats(req, res);
});

router.get(REPORTS_STATS_URL, async (req, res, next) => {
    await administratorMiddleware(req, res, next)
}, async (req, res) => {
    Logger.request(`GET ${REPORTS_STATS_URL}`);

    await getReportsStats(req, res);
});

router.get(ATTENDANCES_TOTAL_STATS_URL, async (req, res, next) => {
    await administratorMiddleware(req, res, next)
}, async (req, res) => {
    Logger.request(`GET ${ATTENDANCES_TOTAL_STATS_URL}`);

    await getEventsAttendancesStats(req, res);
});

router.get(TOP_ORGANIZERS_URL, async (req, res, next) => {
    await administratorMiddleware(req, res, next)
}, async (req, res) => {
    Logger.request(`GET ${TOP_ORGANIZERS_URL}`);

    await getTop5OrganizersByAttendances(req, res);
});

router.get(HISTORIC_STATS_URL,async (req, res, next) => {
    await administratorMiddleware(req, res, next)
}, async (req,res)=> {
    Logger.request(`GET ${HISTORIC_STATS_URL}`);

    await getHistoricStats(req,res);

});

router.get(TOP_REPORTED_ORGANIZRS_URL,async (req, res, next) => {
    await administratorMiddleware(req, res, next)
}, async (req,res)=> {
    Logger.request(`GET ${TOP_REPORTED_ORGANIZRS_URL}`);

    await getTop5ReportedOrganizers(req,res);

});

module.exports = router;
