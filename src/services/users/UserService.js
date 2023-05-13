const { suspendGivenEvent } = require("../events/EventNotificationService");
const { PUBLISHED_STATUS_LBL } = require("../../constants/events/EventStatusConstants");
const { getStateId } = require("../events/EventStateService");
const { eventIncludes } = require("../../repository/EventRepository");
const { Op } = require("sequelize");
const { ACTIVATED_USER } = require("../../constants/messages");
const { BLOCKED_USER } = require("../../constants/messages");
const { getSortedByReportsWithDate } = require("../events/EventReportService");
const { setErrorResponse } = require("../../helpers/ResponseHelper");
const { CREATED_EVENTS_RELATION_NAME } = require("../../constants/dataConstants");
const { logError } = require("../../helpers/Logger");

const { Events } = require("../../data/model/Events");

const { setOkResponse } = require("../../helpers/ResponseHelper");
const { OK_LBL } = require("../../constants/messages");
const { getSerializedUserWithReports } = require("../../repository/UserRepository");

const { EventReportCategory } = require("../../data/model/EventReportCategory");

const {
    EVENTS_REPORT_RELATION_NAME,
    REPORTS_RELATION_NAME
} = require("../../constants/dataConstants");

const { EventReport } = require("../../data/model/EventReport");

const { UNEXISTING_USER_ERR_LBL } = require("../../constants/events/eventsConstants");

const {
    setUnexpectedErrorResponse
} = require("../../helpers/ResponseHelper");

const {
    findOne,
    findAll,
    update
} = require("../../helpers/QueryHelper");

const { User } = require("../../data/model/User");

const userIsOrganizer = async (id, email) => {
    let user;

    if (id) {
        user = await findOne(User,
            {
                id: id,
                is_organizer: true
            }
        );
    } else {
        user = await findOne(User,
            {
                email: email,
                is_organizer: true
            }
        );
    }

    if (user === null || user.error) {
        return false;
    }
    return user;
}

const userIsAdministrator = async (decodedToken) => {
    if (decodedToken.email !== process.env.ADMIN_EMAIL) {
        return false;
    }

    const user = await findOne(User,
        {
            email: decodedToken.email,
            is_administrator: true
        }
    );

    if (! user || user.error) {
        logError(user.error);

        return false;
    }

    return true;
}

const userIsConsumer = async(id, email) => {
    let user;

    if (id) {
        user = await findOne(User,
            {
                id: id,
                is_consumer: true
            }
        );
    } else {
        user = await findOne(User,
            {
                email: email,
                is_consumer: true
            }
        );
    }

    if (user === null || user.error) {
        return false;
    }

    return user;
}

const userIsStaff = async(id, email) => {
    let user;

    if (id) {
        user = await findOne(User,
            {
                id: id,
                is_staff: true
            }
        );
    } else {
        user = await findOne(User,
            {
                email: email,
                is_staff: true
            }
        );
    }

    if (user === null || user.error) {
        return false;
    }

    return user;
}

const userExists = async (id, email) => {
    let user;

    if (id) {
        user = await findOne(User,
            {
                id: id,
            }
        );
    } else {
        user = await findOne(User,
            {
                email: email,
            }
        );
    }

    if (user === null || user.error) {
        return false;
    }

    return user;
}

const userIsBlocked = async (email) => {
    const user = await findOne(User, {
        email: email,

        is_blocked: true
    });

    return user;
}

const getUsers = async (req, res) => {
    let users = await findAll(User,
        {
        },
        [
            {
                model: EventReport,
                attributes: ["text", "createdAt"],
                as: REPORTS_RELATION_NAME,
                include: [
                    {
                        model: Events,
                        as: EVENTS_REPORT_RELATION_NAME
                    },
                    {
                        model: EventReportCategory
                    }
                ]
            },
            {
                model: Events,
                as: CREATED_EVENTS_RELATION_NAME
            }
        ]
        );

    if (users.error) {
        return setUnexpectedErrorResponse(users.error, res);
    }

    getSortedByReportsWithDate(req.query.startDate,
                               req.query.endDate,
                               users);

    const serializedUsers = await Promise.all(
        users.map(async user => await getSerializedUserWithReports(user))
    );

    const responseBody = {
        list: serializedUsers
    }

    return setOkResponse(OK_LBL, res, responseBody);
}

const blockUser = async (req, res) => {
    const body = req.body;

    const user = await findOne(User,
        {
            email: body.email
        });

    if (! user) {
        return setErrorResponse(UNEXISTING_USER_ERR_LBL, res);
    }

    if (user.error) {
        return setUnexpectedErrorResponse(user.error, res);
    }

    const result = await update(User,
        {
            is_blocked: body.block
        },
        {
            email: body.email
        });

    if (result.error) {
        return setUnexpectedErrorResponse(result.error, res);
    }

    if (body.block && user.is_organizer) {
        const publishedId = await getStateId(PUBLISHED_STATUS_LBL);

        if (publishedId.error) {
            return setErrorResponse(publishedId.error, res);
        }

        const eventsToSuspend = await user.getEvents({
            where: {
                state_id: {
                    [Op.eq]: publishedId
                }
            },
            include: eventIncludes
        });

        if (eventsToSuspend.error) {
            return setErrorResponse(publishedId.error, res);
        }

        await Promise.all(
            eventsToSuspend.map(async e => {
                await suspendGivenEvent(e, true);
            })
        );
    }

    const responseMessage = body.block ? BLOCKED_USER : ACTIVATED_USER;

    return setOkResponse(responseMessage, res);
}

module.exports = {
    userIsOrganizer, userExists, userIsConsumer, userIsStaff,
    userIsAdministrator, getUsers, blockUser, userIsBlocked
};
