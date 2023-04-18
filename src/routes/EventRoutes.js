const Logger = require("../services/helpers/Logger");

const express = require('express');
const { firebaseAuthMiddleware } = require("./Middleware");
const { emptyBodyMiddleware } = require("./Middleware");
const { isAllowedMiddleware } = require("./Middleware");
const { handleGetGroup } = require("../services/events/GroupService");
const { handleAddUserToGroup } = require("../services/events/GroupService");
const { isOrganizerMiddleware } = require("./Middleware");
const { EVENT_GROUP_URL } = require("../constants/URLs");
const { EVENT_GROUP_ADD_USER_URL } = require("../constants/URLs");
const { handleEventSignUp } = require("../services/events/EventService");
const { userIsConsumer } = require("../services/users/UserService");
const { EVENT_SIGN_UP_URL } = require("../constants/URLs");
const { getFirebaseUserData } = require("../services/authentication/FirebaseService");
const { handleGetTypes } = require("../services/events/EventService");

const { EVENT_TYPES_URL } = require("../constants/URLs");

const { handleCreate,
    handleSearch,
    handleGet } = require("../services/events/EventService");

const { userIsOrganizer, userExists } = require("../services/users/UserService");

const { setOkResponse,
    setErrorResponse,
    setUnexpectedErrorResponse } = require("../services/helpers/ResponseHelper");

const { isEmpty } = require("../services/helpers/ObjectHelper");
const { EVENT_URL, EVENT_SEARCH_NAME_URL } = require("../constants/URLs");
const { verifyToken } = require("../services/authentication/FirebaseService")
const { findOne } = require("../services/helpers/QueryHelper");

const router = express.Router();


router.use("/event", async (req, res, next) => {
    await emptyBodyMiddleware(req, res, next);
}, async (req, res, next) => {
    await firebaseAuthMiddleware(req, res, next);
});


router.post(EVENT_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userIsOrganizer)
    },
    async (req, res, next) => {
        Logger.request(`POST: ${EVENT_URL}`);

        await handleCreate(req, res);
    });

router.post(EVENT_SIGN_UP_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userIsConsumer)
    },
    async (req, res, next) => {
        Logger.request(`POST: ${EVENT_SIGN_UP_URL}`);

        await handleEventSignUp(req, res);
    });

router.get(EVENT_SEARCH_NAME_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userExists)
    },
    async (req, res, next) => {
        Logger.request(`GET: ${EVENT_SEARCH_NAME_URL}`);

        await handleSearch(req, res);
    });

router.get(EVENT_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userExists)
    },
    async (req, res, next) => {
        Logger.request(`GET: ${EVENT_URL}`);

        await handleGet(req, res);
    });

router.get(EVENT_TYPES_URL,
    async (req, res, next) => {
        await isAllowedMiddleware(req, res, next, userIsOrganizer)
    },
    async (req, res, next) => {
        Logger.request(`GET: ${EVENT_TYPES_URL}`);

        await handleGetTypes(req, res);
    });

router.post(EVENT_GROUP_ADD_USER_URL, async (req, res, next) => {
    await isOrganizerMiddleware(req, res, next, userIsOrganizer) },
    async (req, res) => {
        Logger.request(`POST: /event/group/addUsers`);
        await handleAddUserToGroup(req, res);
    });

router.get(EVENT_GROUP_URL, async (req, res, next) => {
        await isOrganizerMiddleware(req, res, next, userIsOrganizer)
    },
    async (req, res) => {
        Logger.request(`POST: /event/group`);

        await handleGetGroup(req, res);
    })

module.exports = router;
