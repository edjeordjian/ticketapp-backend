const express = require("express");
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

module.exports = router;
