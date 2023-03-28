const {logInfo} = require("../helpers/Logger");

const {OK_LBL} = require("../../constants/messages");

const {ERROR_CREATING_USER_LBL} = require("../../constants/login/logInConstants");

const {Users} = require("../../data/model/Users");

const {ERROR_SEARCHING_USER} = require("../../constants/login/logInConstants");

const {LOGIN_SUCCESS_LBL} = require("../../constants/login/logInConstants");

const {setErrorResponse} = require("../helpers/ResponseHelper");

const {setOkResponse} = require("../helpers/ResponseHelper");

const {findOne, create} = require("../helpers/QueryHelper");


const handleSignUp = async (body) => {
    const createResponse = await create(Users, {
        id: body.id,
        email: body.email,
        isAdministrator: body.isAdministrator !== undefined,
        isOrganizer: body.isOrganizer !== undefined,
        isConsumer: body.isConsumer !== undefined,
        firstName: body.firstName,
        lastName: body.lastName,
        pictureUrl: body.pictureUrl
    } );

    if (createResponse.error) {
        return {
            error: createResponse.error
        };
    }

    /* const firebaseResponse = await auth.createUser( {
        email: body.email,
        emailVerified: true,
        disabled: false
    } )
        .catch(error => {
            return {
                error: error.toString()
            }
        } );

    if (firebaseResponse.error) {
        return {
            error: ERROR_CREATING_USER_LBL
        };
    }*/

    return {
        id: createResponse.id,

        email: createResponse.email
    };
}

const handleLogIn = async (req, res) => {
    const body = req.body;

    const findResponse = await findOne(Users, {
        email: body.email
    } );

    let email;
    let id;

    if (findResponse === null) {
        const result = await handleSignUp(body);

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
