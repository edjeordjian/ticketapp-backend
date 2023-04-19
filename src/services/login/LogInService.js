const { logInfo } = require("../helpers/Logger");

const { OK_LBL } = require("../../constants/messages");

const { ERROR_CREATING_USER_LBL } = require("../../constants/login/logInConstants");

const { User } = require("../../data/model/User");
const { Group } = require("../../data/model/Group");

const { ERROR_SEARCHING_USER } = require("../../constants/login/logInConstants");

const { LOGIN_SUCCESS_LBL } = require("../../constants/login/logInConstants");

const { setErrorResponse } = require("../helpers/ResponseHelper");

const { setOkResponse } = require("../helpers/ResponseHelper");

const { findOne, create, update } = require("../helpers/QueryHelper");




const handleSignUp = async (body) => {
    const createResponse = await create(User, {
        id: body.id,
        email: body.email,
        is_administrator: body.isAdministrator !== undefined,
        is_organizer: body.isOrganizer !== undefined,
        is_consumer: body.isConsumer !== undefined,
        first_name: body.firstName,
        last_name: body.lastName,
        picture_url: body.pictureUrl
    }).then(async (user) => {
        logInfo(body);

        if (body.isOrganizer) {
            const group = await create(Group, {
                organizer_email: body.email
            });

            await group.addUser(user);

            logInfo(group);
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

const handleRoleAppend = async (body, user) => {
    const createResponse = await update(User, {
        is_administrator: body.isAdministrator || user.is_administrator,
        is_organizer: body.isOrganizer || user.is_organizer,
        is_consumer: body.isConsumer || user.is_consumer
    },
        {
            email: body.email
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

const handleLogIn = async (req, res) => {
    const body = req.body;

    const findResponse = await findOne(User, {
        email: body.email
    });

    let email;
    let id;

    if (findResponse === null) {
        const result = await handleSignUp(body);

        if (result.error !== undefined) {
            return setErrorResponse(ERROR_CREATING_USER_LBL, res);
        }

        id = result.id;
        email = result.email;
    } else if (findResponse.is_administrator !== body.isAdministrator ||
        findResponse.is_organizer !== body.isOrganizer ||
        findResponse.is_consumer !== body.isConsumer) {
        const result = await handleRoleAppend(body, findResponse);

        if (result.error !== undefined) {
            return setErrorResponse(ERROR_CREATING_USER_LBL, res);
        }

        id = result.id;
        email = result.email;
    } else {
        if (findResponse.error !== undefined) {
            return setErrorResponse(ERROR_SEARCHING_USER, res);
        }

        id = findResponse.id;
        email = findResponse.email;
    }

    logInfo(`${LOGIN_SUCCESS_LBL} ${email}`);

    const userData = {
        id: id
    };

    return setOkResponse(OK_LBL, res, userData);
};

module.exports = {
    handleLogIn
};
