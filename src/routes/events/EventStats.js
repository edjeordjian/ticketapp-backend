const express = require("express");

const Logger = require("../../helpers/Logger");

const {  getGeneralAttendancesStats } = require("../../services/events/EventStatsService");

const {
    EVENT_STATUS_STATS_URL,
    ATTENDANCES_STATS_URL,
    GENERAL_EVENT_ATTENDANCES,
    REPORTS_STATS_URL,
    TOP_ORGANIZERS_URL,
    ATTENDANCES_TOTAL_STATS_URL,
    HISTORIC_STATS_URL
} = require("../../constants/URLs");

const { userIsStaff } = require("../../services/users/UserService");

const {
    isAllowedMiddleware,
    administratorMiddleware
} = require("../authentication/Middleware");

const {
    getReportsStats,
    getEventStatusStats,
    getTop5OrganizersByAttendances,
    getEventsAttendancesStats,
    getHistoricStats
} = require("../../services/events/EventStatsService");

const {
    getAttendancesStats,
} = require("../../services/events/EventService");

const router = express.Router();

router.get(ATTENDANCES_STATS_URL, async (req, res, next) => {
    await isAllowedMiddleware(req, res, next, userIsStaff);
}, async (req, res) => {
    Logger.request(`GET ${ATTENDANCES_STATS_URL}`);

    await getAttendancesStats(req, res);
});

router.get(EVENT_STATUS_STATS_URL, async (req, res, next) => {
    await administratorMiddleware(req, res, next)
}, async (req, res) => {
    Logger.request(`GET ${EVENT_STATUS_STATS_URL}`);

    await getEventStatusStats(req, res);
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

})

router.get(GENERAL_EVENT_ATTENDANCES, async (req, res, next) => {
    await administratorMiddleware(req, res, next);
}, async (req,res) => {
    Logger.request(`GET ${GENERAL_EVENT_ATTENDANCES}`)

    await getGeneralAttendancesStats(req,res)
})

module.exports = router;
