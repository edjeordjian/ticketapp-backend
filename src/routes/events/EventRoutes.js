const Logger = require("../../services/helpers/Logger");

const express = require('express');
const { getFirebaseUserData } = require("../../services/authentication/FirebaseService");
const { handleGetTypes } = require("../../services/events/EventService");

const { EVENT_TYPES_URL } = require("../../constants/URLs");

const { handleCreate,
    handleSearch,
    handleGet } = require("../../services/events/EventService");

const { userIsOrganizer, userExists } = require("../../services/users/UserService");

const { setOkResponse,
    setErrorResponse,
    setUnexpectedErrorResponse } = require("../../services/helpers/ResponseHelper");

const { isEmpty } = require("../../services/helpers/ObjectHelper");
const { EVENT_URL, EVENT_SEARCH_NAME_URL } = require("../../constants/URLs");
const { verifyToken } = require("../../services/authentication/FirebaseService")
const { findOne } = require("../../services/helpers/QueryHelper");

const router = express.Router();

const isOrganizerMiddleware = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await verifyToken(token);
    const isOrganizer = await userIsOrganizer(decodedToken.email);
    if (isOrganizer) {
        next();
    } else {
        return setErrorResponse("Acceso solo para organizadores.", res, 401);
    }

}

router.use("/event", async (req, res, next) => {
    if (req.method === "POST" && isEmpty(req.body)) {
        return setErrorResponse("Error en la petición.", res, 400);
    } else {
        next();
    }
}, async (req, res, next) => {
    let token;

    if (req.headers.expo && req.headers.authorization) {
        const userData = await getFirebaseUserData(req.headers.authorization.split(" ")[1]);

        if (userData.id) {
            next();
        } else {
            return setErrorResponse("No autorizado", res, 400);
        }
    } else {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        } else {
            return setErrorResponse("No autorizado", res, 400);
        }
        const decodedToken = await verifyToken(token);
        if (decodedToken === false) {
            return setErrorResponse("Token inválido. Por favor volver a ingresar.", res, 400);
        } else {
            const exists = await userExists(decodedToken.email);
            if (exists) {
                next();
            } else {
                return setErrorResponse("Falta ingresar", res, 400);
            }
        }
    }
}
);


router.post(EVENT_URL, async (req, res, next) => { isOrganizerMiddleware(req, res, next) },
    async (req, res, next) => {

        Logger.request(`POST: ${EVENT_URL}`);
        await handleCreate(req, res);
    });

router.get(EVENT_SEARCH_NAME_URL, async (req, res) => {
    Logger.request(`GET: ${EVENT_SEARCH_NAME_URL}`);

    await handleSearch(req, res);
});

router.get(EVENT_URL, async (req, res) => {
    Logger.request(`GET: ${EVENT_URL}`);

    await handleGet(req, res);
});

router.get(EVENT_TYPES_URL, async (req, res, next) => { isOrganizerMiddleware(req, res, next) },
    async (req, res, next) => {
        Logger.request(`GET: ${EVENT_TYPES_URL}`);

        await handleGetTypes(req, res);
    });

module.exports = router;
