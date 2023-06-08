const express = require("express");

const Logger = require("../../helpers/Logger");

const { REPORTS_STATS_URL } = require("../../constants/URLs");

const {
    EVENTS_DATES_STATS_URL,
    EVENT_STATUS_STATS_URL,
    ATTENDANCES_STATS_URL
} = require("../../constants/URLs");

const { userIsStaff } = require("../../services/users/UserService");

const {
    isAllowedMiddleware,
    administratorMiddleware
} = require("../authentication/Middleware");

const {
    getReportsStats,
    getEventStatusStats,
    getEventsDatesStats
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

module.exports = router;
