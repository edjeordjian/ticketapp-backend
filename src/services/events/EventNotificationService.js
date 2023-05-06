const { IS_PRODUCTION } = require("../../constants/dataConstants");
const { SUSPENDED_EVENT_LBL } = require("../../constants/events/eventsConstants");
const { eventIncludes } = require("../../repository/EventRepository");
const { getCanceledStateId } = require("./EventStateService");
const { Op } = require("sequelize");
const { User } = require("../../data/model/User");
const { Events } = require("../../data/model/Events");
const { findAll } = require("../../helpers/QueryHelper");
const { OK_LBL } = require("../../constants/messages");
const {
    EVENT_WAS_MODIFIED,
    CANCELLED_EVENT_LBL,
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
    const canceledId = await getCanceledStateId();

    const now = new Date();

    if (IS_PRODUCTION) {
        now.setHours(now.getHours() - 3);
    }

    now.setUTCSeconds(0);

    now.setUTCMilliseconds(0);

    let tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // + 1 day

    tomorrow.setUTCHours(3);

    tomorrow.setUTCMinutes(0);

    let nextMinute = new Date(now.getTime() + 60 * 1000); // + 1 minute

    nextMinute.setUTCFullYear(2020);

    nextMinute.setUTCMonth(0);

    nextMinute.setUTCDate(1);

    let adaptedNow = new Date(now.getTime());

    adaptedNow.setUTCFullYear(2020);

    adaptedNow.setUTCMonth(0);

    adaptedNow.setUTCDate(1);

    console.log(adaptedNow);

    console.log(nextMinute);

    let tomorrowEvents = await findAll(Events,
        {
            date: tomorrow,

            time:
                {
                    [Op.gte]: adaptedNow,

                    [Op.lt]:  nextMinute
                },

            state_id: {
                [Op.ne]: canceledId
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
}

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

const notifyCancelledEvent = async (e, suspended) => {
    let label = CANCELLED_EVENT_LBL;

    if (suspended) {
        label = SUSPENDED_EVENT_LBL
    }

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

module.exports = {
    notifyTomorrowEvents, notifyCancelledEvent, notifyEventChange,
    getAttendeesTokens
};

