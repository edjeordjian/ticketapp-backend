const Logger = require("../../services/helpers/Logger");

const express = require("express");
const { handleGetTypes } = require("../../services/events/EventService");

const { EVENT_TYPES_URL } = require("../../constants/URLs");

const { handleCreate,
    handleSearch,
    handleGet } = require("../../services/events/EventService");

const { userExists } = require("../../services/users/UserService");

const { setOkResponse,
    setErrorResponse,
    setUnexpectedErrorResponse } = require("../../services/helpers/ResponseHelper");

const { isEmpty } = require("../../services/helpers/ObjectHelper");
const { EVENT_URL, EVENT_SEARCH_NAME_URL } = require("../../constants/URLs");
const { verifyToken } = require("../../services/authentication/FirebaseService")
const { findOne } = require("../../services/helpers/QueryHelper");

const router = express.Router();

router.use("/event", async (req, res, next) => {
    if (req.method === "POST" && isEmpty(req.body)) {
        return setErrorResponse("Body cannot be null", res, 400);
    } else {
        next();
    }
}, async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else {
        return setErrorResponse("Missing authorization token", res, 400);
    }
    const decodedToken = await verifyToken(token);
    if (decodedToken === false) {
        return setErrorResponse("Invalid authorization token", res, 400);
    } else {
        const exists = await userExists(decodedToken.email);
        if (exists) {
            next();
        } else {
            return setErrorResponse("User hasn't signed up yet", res, 400);
        }
    }
}
);

router.post(EVENT_URL, async (req, res) => {
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

router.get(EVENT_TYPES_URL, async (req, res) => {
    Logger.request(`GET: ${EVENT_TYPES_URL}`);

    await handleGetTypes(req, res);
});

module.exports = router;
