const Logger = require("../helpers/Logger");

const express = require("express");

const { saveRecordOfEventScheduleInCalendar } = require("../services/events/EventCalendarScheduleService");

const { EVENT_CALENDAR_SCHEDULE_URL } = require("../constants/URLs");

const { userIsConsumer } = require("../services/users/UserService");

const { isAllowedMiddleware } = require("./Middleware");

const router = express.Router();

router.post(EVENT_CALENDAR_SCHEDULE_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userIsConsumer)
    },
    async (req, res, next) => {
        Logger.request(`POST: ${EVENT_CALENDAR_SCHEDULE_URL}`)

        await saveRecordOfEventScheduleInCalendar(req, res);
    }
);

module.exports = router;
