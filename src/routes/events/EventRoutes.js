const Logger = require("../../services/helpers/Logger");

const express = require('express');
const { handleGetTypes } = require("../../services/events/EventService");


const { handleCreate,
    handleSearch,
    handleGet } = require("../../services/events/EventService");

const { handleAddUserToGroup, handleGetGroup } = require("../../services/events/GroupService");

const { EVENT_URL, EVENT_SEARCH_NAME_URL, EVENT_GROUP_ADD_USER_URL, EVENT_TYPES_URL, EVENT_GROUP_URL } = require("../../constants/URLs");

const { isOrganizerMiddleware, emptyBodyMiddleware, firebaseAuthMiddleware } = require("../middleware/Middleware");
const router = express.Router();



router.use("/event", async (req, res, next) => {
    emptyBodyMiddleware(req, res, next);
}, async (req, res, next) => {
    firebaseAuthMiddleware(req, res, next);
});


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


router.post(EVENT_GROUP_ADD_USER_URL, async (req, res, next) => { isOrganizerMiddleware(req, res, next) },
    async (req, res) => {
        Logger.request(`POST: /event/group/addUser`);
        await handleAddUserToGroup(req, res);
    });

router.get(EVENT_GROUP_URL, async (req, res, next) => { isOrganizerMiddleware(req, res, next) },
    async (req, res) => {
        Logger.request(`POST: /event/group`);

        await handleGetGroup(req, res);
    })





module.exports = router;
