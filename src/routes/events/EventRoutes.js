const Logger = require("../../services/helpers/Logger");

const express = require('express');

const { handleCreate, handleGet } = require("../../services/events/EventService");

const { EVENT_URL } = require("../../constants/URLs");

const router = express.Router();

router.post(EVENT_URL, async (req, res) => {
    Logger.request(EVENT_URL)

    await handleCreate(req, res);
});

router.get(EVENT_URL, async (req, res) => {
    Logger.request(EVENT_URL)
    await handleGet(req, res);
})



module.exports = router;
