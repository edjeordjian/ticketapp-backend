const { BLOCKED_USER } = require("../../constants/messages");
const { setErrorResponse } = require("../../helpers/ResponseHelper");
const { userIsBlocked } = require("../users/UserService");
const { UNEXISTING_USER_ERR_LBL } = require("../../constants/events/eventsConstants");
const { setUnexpectedErrorResponse } = require("../../helpers/ResponseHelper");

const { logInfo } = require("../../helpers/Logger");

const { OK_LBL } = require("../../constants/messages");

const { ERROR_CREATING_USER_LBL } = require("../../constants/login/logInConstants");

const { User } = require("../../data/model/User");

const { Group } = require("../../data/model/Group");

const { ERROR_SEARCHING_USER } = require("../../constants/login/logInConstants");

const { LOGIN_SUCCESS_LBL } = require("../../constants/login/logInConstants");

const { setOkResponse } = require("../../helpers/ResponseHelper");

const { findOne, create, update } = require("../../helpers/QueryHelper");

const addUserToNewGroup = async (user) => {
    const group = await create(Group, {
        organizer_email: user.email
    });

    if (group.error) {
        return {
            group: group.error
        }
    }

    await group.addUser(user);

    logInfo(group);

    return {
        result: group
    }
}

const handleSignUp = async (body) => {
    const createResponse = await create(User, {
        id: body.id,
        email: body.email,
        is_administrator: body.isAdministrator !== undefined,
        is_organizer: body.isOrganizer !== undefined,
        is_consumer: body.isConsumer !== undefined,
        is_staff: body.isStaff !== undefined,
        first_name: body.firstName,
        last_name: body.lastName,
        picture_url: body.pictureUrl
    }).then(async (user) => {
        if (body.isOrganizer) {
            const result = await addUserToNewGroup(user);

            if (result.error) {
                return result;
            }
        }

        return user;
    });

    if (createResponse.error) {
        return {
            error: createResponse.error
        };
    }

    return {
        id: createResponse.id,

        email: createResponse.email
    };
}

const handleExpoTokenUpdate = async (expo_token, user)  => {
    if (! expo_token) {
        return {
            id: user.id,

            email: user.email
        }
    }

    const updateResponse = await update(User,
        {
            expo_token: expo_token
        },
        {
            email: user.email
        });

    if (! updateResponse || updateResponse.error) {
        return {
            error: updateResponse.error
        };
    }

    return {
        id: updateResponse.id,

        email: updateResponse.email
    };
}

const handleRoleAppend = async (body, user) => {
    const userWasNotOrganizer = ! user.is_organizer;

    const updateResponse = await update(User,
        {
            is_administrator: body.isAdministrator || user.is_administrator,
            is_organizer: body.isOrganizer || user.is_organizer,
            is_consumer: body.isConsumer || user.is_consumer,
            is_staff: body.isStaff || user.is_staff
        },
        {
            email: body.email
        });

    if (! updateResponse || updateResponse.error) {
        return {
            error: updateResponse.error
        };
    }

    if (body.isOrganizer && userWasNotOrganizer) {
        const group = await addUserToNewGroup(user);

        if (group.error) {
            return group;
        }
    }

    return {
        id: updateResponse.id
    };
}

const handleLogIn = async (req, res) => {
    const body = req.body;

    const findResponse = await findOne(User, {
        email: body.email
    });

    let email;
    let id;

    if (findResponse === null) {
        const result = await handleSignUp(body);

        if (result.error) {
            return setUnexpectedErrorResponse(ERROR_CREATING_USER_LBL, res);
        }

        id = result.id;
        email = result.email;
    } else {
        if (findResponse.error) {
            return setUnexpectedErrorResponse(ERROR_SEARCHING_USER, res);
        }

        if (await userIsBlocked(findResponse.email)) {
            return setErrorResponse(BLOCKED_USER, res, 403);
        }

        id = findResponse.id;

        email = findResponse.email;

        const result = await handleExpoTokenUpdate(body.expoToken, findResponse);

        if (result.error) {
            return setUnexpectedErrorResponse(result.error);
        }

        if ((! findResponse.is_administrator && body.isAdministrator) ||
            (! findResponse.is_organizer && body.isOrganizer) ||
            (! findResponse.is_consumer && body.isConsumer) ||
            (! findResponse.is_staff && body.isStaff)) {

            const result = await handleRoleAppend(body, findResponse);

            if (result.error) {
                return setUnexpectedErrorResponse(ERROR_CREATING_USER_LBL, res);
            }

            id = body.id;

            email = body.email;
        }
    }

    logInfo(`${LOGIN_SUCCESS_LBL} ${email}`);

    const userData = {
        id: id
    };

    return setOkResponse(OK_LBL, res, userData);
};

const getUserWithEmail = async(userEmail) => {
    const user = await findOne(User, {
        email: userEmail
    });

    if (! user) {
        return {
            error: UNEXISTING_USER_ERR_LBL
        }
    }

    return user;
}

module.exports = {
    handleLogIn, getUserWithEmail, addUserToNewGroup
};
