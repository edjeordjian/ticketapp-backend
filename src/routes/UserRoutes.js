const express = require("express");
const { blockUser } = require("../services/users/UserService");
const { USER_BLOCK_URL } = require("../constants/URLs");
const { administratorMiddleware } = require("./Middleware");
const { USER_ALL } = require("../constants/URLs");
const { getUsers } = require("../services/users/UserService");

const router = express.Router();

router.get(USER_ALL,
    async (req, res, next) => {
        await administratorMiddleware(req, res, next)
    },
    async (req, res) => {
        await getUsers(req, res);
    });

router.patch(USER_BLOCK_URL,
    async (req, res, next) => {
        await administratorMiddleware(req, res, next)
    },
    async (req, res) => {
        await blockUser(req, res);
    });


module.exports = router;
