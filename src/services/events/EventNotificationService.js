const {
    SUSPENDED_STATUS_LBL,
    PUBLISHED_STATUS_LBL
} = require("../../constants/events/EventStatusConstants");

const {
    SUSPENDED_EVENT_LBL,
    UNSUSPENDED_EVENT_LBL
} = require("../../constants/events/eventsConstants");

const { getStateId } = require("./EventStateService");
const { CANCELLED_STATUS_LBL } = require("../../constants/events/EventStatusConstants");
const { IS_PRODUCTION } = require("../../constants/dataConstants");
const { eventIncludes } = require("../../repository/EventRepository");
const { Op } = require("sequelize");
const { User } = require("../../data/model/User");
const { Events } = require("../../data/model/Events");
const {
    findAll,
    update
} = require("../../helpers/QueryHelper");
const { OK_LBL } = require("../../constants/messages");
const {
    EVENT_WAS_MODIFIED,
    EVENT_IS_TOMORROW_LBL,
    EVENT_SCREEN_NAME
} = require("../../constants/events/eventsConstants");

const { SendNotification } = require("../../helpers/SendNotification");

const getAttendeesTokens = async (e) => {
    let tokens = []

    if (e.attendees) {
        const userIds = e.attendees.map(attendee => attendee.attendances.userId);

        const users = await findAll(User,
            {
                id: {
                    [Op.in]: userIds
                }

            });

        if (users.error) {
            return users.error
        }

        if (users) {
            tokens = users.map(user => user.expo_token);
        }
    }

    return tokens;
}

const notifyTomorrowEvents = async () => {
    const publishedId = await getStateId(PUBLISHED_STATUS_LBL);

    const now = new Date();

    if (IS_PRODUCTION) {
        now.setHours(now.getHours() - 3);
    }

    now.setUTCSeconds(0);

    now.setUTCMilliseconds(0);

    let tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // + 1 day

    tomorrow.setUTCHours(3);

    tomorrow.setUTCMinutes(0);

    if (IS_PRODUCTION) {
        tomorrow.setHours(0);
    }

    let nextMinute = new Date(now.getTime() + 60 * 1000); // + 1 minute

    nextMinute.setUTCFullYear(2020);

    nextMinute.setUTCMonth(0);

    nextMinute.setUTCDate(1);

    let adaptedNow = new Date(now.getTime());

    adaptedNow.setUTCFullYear(2020);

    adaptedNow.setUTCMonth(0);

    adaptedNow.setUTCDate(1);

    let whereTime = {
        [Op.gte]: adaptedNow,

        [Op.lt]:  nextMinute
    };

    if (nextMinute.getHours() === 0 && nextMinute.getMinutes() === 0) {
        whereTime = {
            [Op.gte]: adaptedNow
        }
    }

    let tomorrowEvents = await findAll(Events,
        {
            date: tomorrow,

            time: whereTime,

            state_id: {
                [Op.ne]: publishedId
            }
        },
        eventIncludes
    );

    if (tomorrowEvents.error) {
        return tomorrowEvents.error;
    }

    return await Promise.all(
        tomorrowEvents.map(async e => {
            await sendNotificationTo(e,
                {
                    title: e.name,

                    body: EVENT_IS_TOMORROW_LBL,

                    data: {
                        screenName: EVENT_SCREEN_NAME,

                        params: {
                            eventId: e.id
                        }
                    }
                } );
        })
    );
};

const notifyEventChange = async(e, originalName) => {
    return await sendNotificationTo(e,
        {
            title: originalName,

            body: EVENT_WAS_MODIFIED,

            data: {
                screenName: EVENT_SCREEN_NAME,

                params: {
                    eventId: e.id
                }
            }
        } );
}

const notifiyEventStatus = async (e, label) => {
    return await sendNotificationTo(e,
        {
            title: e.name,

            body: label,

            data: {
                screenName: EVENT_SCREEN_NAME,

                params: {
                    eventId: e.id
                }
            }
        } );
}

const sendNotificationTo = async (e, body) => {
    const errors = [];

    const tokens = await getAttendeesTokens(e);

    await Promise.all(
        tokens.map(async token => {
            body.to = token;

            const result = await SendNotification(body);

            if (result.error) {
                errors.push(result.error);
            }
        })
    );

    if (errors.length > 0) {
        return {
            error: errors
        }
    }

    return {
        message: OK_LBL
    };
}

const suspendGivenEvent = async (e, suspend) => {
    let stateId;

    if (! suspend) {
        stateId = await getStateId(PUBLISHED_STATUS_LBL);
    } else {
        stateId = await getStateId(SUSPENDED_STATUS_LBL);
    }

    if (stateId.error) {
        return stateId;
    }

    const updateResult = await update(Events,
        {
            state_id: stateId
        },
        {
            id: e.id
        });

    if (updateResult.error) {
        return updateResult;
    }

    let notificationResponse;

    let label;

    if (! suspend) {
        label = UNSUSPENDED_EVENT_LBL;

        notificationResponse = await notifiyEventStatus(e, label);
    } else {
        label = SUSPENDED_EVENT_LBL;

        notificationResponse = await notifiyEventStatus(e, label);
    }

    if (notificationResponse.error) {
        return notificationResponse;
    }

    return {
        message: label
    };
}

module.exports = {
    notifyTomorrowEvents, notifiyEventStatus, notifyEventChange,
    getAttendeesTokens, suspendGivenEvent
};
