const Logger = require("../helpers/Logger");
const { BLOCKED_USER } = require("../constants/messages");
const { userIsBlocked } = require("../services/users/UserService");
const { EXPIRED_TOKEN_ERR_LBL } = require("../constants/login/logInConstants");
const { ONLY_ADMIN_ERR_LBL } = require("../constants/login/logInConstants");
const { DENIED_ACCESS_ERR_LBL } = require("../constants/login/logInConstants");
const { userIsAdministrator } = require("../services/users/UserService");

const { getFirebaseUserData } = require("../services/authentication/FirebaseService");

const { userIsOrganizer, userExists } = require("../services/users/UserService");

const { setErrorResponse } = require("../helpers/ResponseHelper");

const { isEmpty } = require("../helpers/ObjectHelper");

const { verifyToken } = require("../services/authentication/FirebaseService")


const isOrganizerMiddleware = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return setErrorResponse("Acceso solo para organizadores.", res, 401);
    }

    const token = authorization.split(' ')[1];

    const decodedToken = await verifyToken(token);
    const isOrganizer = await userIsOrganizer(null, decodedToken.email);
    if (isOrganizer) {
        next();
    } else {
        return setErrorResponse("Acceso solo para organizadores.", res, 401);
    }

}

const administratorMiddleware = async (req, res, next, logIn) => {
    const authorization = req.headers.authorization;

    const body = req.body;

    if (! logIn && ! req.headers.isadministrator) {
        return setErrorResponse(ONLY_ADMIN_ERR_LBL, res, 404);
    }

    if (req.headers.isadministrator) {
        if (! authorization || authorization.split(' ').length < 2){
            return setErrorResponse(ONLY_ADMIN_ERR_LBL, res, 404);
        }

        const token = authorization.split(' ')[1];

        const decodedToken = await verifyToken(token);

        if (! decodedToken) {
            return setErrorResponse(EXPIRED_TOKEN_ERR_LBL, res, 404);
        }

        const isAdministrator = await userIsAdministrator(decodedToken);

        if (! isAdministrator) {
            return setErrorResponse(DENIED_ACCESS_ERR_LBL, res, 404);
        }
    } else if (await userExists(null, body.email) && await userIsBlocked(body.email)) {
        return setErrorResponse(BLOCKED_USER, res, 404);
    }

    next();
}

const emptyBodyMiddleware = async (req, res, next) => {
    if (req.method === "POST" && isEmpty(req.body)) {
        return setErrorResponse("Error en la petición. Body", res, 400);
    } else {
        next();
    }
}

const isAllowedMiddleware = async (req, res, next, check_fn) => {
    if (! req.headers.authorization) {
        return setErrorResponse("Acceso reestringido.", res, 401);
    }

    const token = req.headers.authorization.split(' ')[1];

    let isAllowed;

    if (req.headers.expo) {
        const userData = await getFirebaseUserData(token);

        isAllowed = await check_fn(userData.id, null);
    } else {
        const decodedToken = await verifyToken(token);

        isAllowed = await check_fn(null, decodedToken.email);
    }

    if (isAllowed) {
        next();
    } else {
        return setErrorResponse("Acceso reestringido.", res, 401);
    }
}

const firebaseAuthMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.expo && req.headers.authorization) {
        const userData = await getFirebaseUserData(req.headers.authorization.split(" ")[1]);

        if (userData.id) {
            next();
        } else {
            return setErrorResponse(EXPIRED_TOKEN_ERR_LBL, res, 400);
        }
    } else {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        } else {
            return setErrorResponse("No autorizado", res, 400);
        }
        const decodedToken = await verifyToken(token);
        if (decodedToken === false) {
            return setErrorResponse(EXPIRED_TOKEN_ERR_LBL, res, 400);
        } else {
            const exists = await userExists(null, decodedToken.email);
            if (exists) {
                req.decodedToken = decodedToken;
                next();
            } else {
                return setErrorResponse("Falta ingresar", res, 400);
            }
        }
    }
}

module.exports = {
    firebaseAuthMiddleware, emptyBodyMiddleware, isOrganizerMiddleware, isAllowedMiddleware,
    administratorMiddleware
};
