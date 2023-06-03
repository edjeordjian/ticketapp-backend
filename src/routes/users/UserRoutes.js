const Logger = require("../../helpers/Logger");

const express = require("express");
const { blockUser } = require("../../services/users/UserService");
const { USER_BLOCK_URL } = require("../../constants/URLs");
const { administratorMiddleware } = require("../authentication/Middleware");
const { USER_ALL } = require("../../constants/URLs");
const { getUsers } = require("../../services/users/UserService");

const router = express.Router();

router.get(USER_ALL,
    async (req, res, next) => {
        await administratorMiddleware(req, res, next)
    },
    async (req, res) => {
        Logger.request(`GET: ${USER_ALL}`);

        await getUsers(req, res);
    });

router.patch(USER_BLOCK_URL,
    async (req, res, next) => {
        await administratorMiddleware(req, res, next)
    },
    async (req, res) => {
        Logger.request(`PATCH: ${USER_BLOCK_URL}`);

        await blockUser(req, res);
    });


module.exports = router;
