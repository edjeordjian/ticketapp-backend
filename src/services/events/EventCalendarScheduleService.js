const {
    UNEXISTING_USER_ERR_LBL,
    EVENT_DOESNT_EXIST_ERR_LBL
} = require("../../constants/events/eventsConstants");

const { User } = require("../../data/model/User");

const { Events } = require("../../data/model/Events");

const { EventCalendarSchedule } = require("../../data/model/EventCalendarSchedule");

const {
    create,
    findOne
} = require("../../helpers/QueryHelper");

const {
    MISSING_EVENT_DATA_ERR_LBL,
    EVENT_SCHEDULED_LBL
} = require("../../constants/events/eventScheduleConstants");

const {
    setOkResponse,
    setErrorResponse,
    setUnexpectedErrorResponse
} = require("../../helpers/ResponseHelper");

const saveRecordOfEventScheduleInCalendar = async (req, res) => {
    const {
        userId,
        eventId,
        scheduleId
    } = req.body;

    if (!userId || !eventId || !scheduleId) {
        return setErrorResponse(MISSING_EVENT_DATA_ERR_LBL, res);
    }

    const user = await findOne(User, {
        id: userId
    });

    if (!user) {
        return setErrorResponse(UNEXISTING_USER_ERR_LBL, res);
    }

    if (user.error) {
        return setUnexpectedErrorResponse(user.error, res);
    }

    const event = await findOne(Events, {
        id: eventId
    });

    if (!event) {
        return setErrorResponse(EVENT_DOESNT_EXIST_ERR_LBL, res);
    }

    if (event.error) {
        return setUnexpectedErrorResponse(event.error, res);
    }

    const creationResult = await create(EventCalendarSchedule, {
        userId: userId,
        eventId: eventId,
        schedule_id: scheduleId
    });

    if (creationResult.error) {
        return setUnexpectedErrorResponse(creationResult.error, res);
    }

    return setOkResponse(EVENT_SCHEDULED_LBL, res);
};

const getScheduleId = (e, userId) => {
    const lastSchedule = e.event_calendar_schedules
        .filter(schedule => schedule.userId === userId)
        .reduce((a, b) => a.createdAt > b.createdAt ? a : b);

    if (lastSchedule) {
        return lastSchedule.schedule_id;
    }

    return -1;
}

module.exports = {
    saveRecordOfEventScheduleInCalendar, getScheduleId
};
