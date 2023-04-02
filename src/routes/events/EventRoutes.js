const Logger = require("../../services/helpers/Logger");

const express = require('express');
const {handleGetTypes} = require("../../services/events/EventService");

const {EVENT_TYPES_URL} = require("../../constants/URLs");

const {handleCreate,
       handleSearch,
       handleGet} = require("../../services/events/EventService");

const {EVENT_URL, EVENT_SEARCH_NAME_URL} = require("../../constants/URLs");

const router = express.Router();

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
})

router.get(EVENT_TYPES_URL, async (req, res) => {
    Logger.request(`GET: ${EVENT_TYPES_URL}`);

    await handleGetTypes(req, res);
});

module.exports = router;
