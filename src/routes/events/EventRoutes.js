const Logger = require("../../services/helpers/Logger");

const express = require('express');
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
        setErrorResponse("User doesn't have an organizer role", res, 401);
        return;
    }

}

router.use("/event", async (req, res, next) => {
    if (req.method === "POST" && isEmpty(req.body)) {
        setErrorResponse("Body cannot be null", res, 400);
        return;
    } else {
        next();
    }
}, async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else {
        setErrorResponse("Missing authorization token", res, 400);
        return;
    }
    const decodedToken = await verifyToken(token);
    if (decodedToken == false) {
        setErrorResponse("Invalid authorization token", res, 401);
        return;
    } else {
        const exists = await userExists(decodedToken.email);
        console.log(decodedToken.email);
        if (exists) {
            next();
        } else {
            setErrorResponse("User hasn't signed up yet", res, 401);
            return;
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
})

router.get(EVENT_TYPES_URL, async (req, res, next) => { isOrganizerMiddleware(req, res, next) },
    async (req, res, next) => {
        Logger.request(`GET: ${EVENT_TYPES_URL}`);

        await handleGetTypes(req, res);
    });

module.exports = router;
