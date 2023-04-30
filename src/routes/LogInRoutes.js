const Logger = require("../helpers/Logger");

const express = require('express');

const { administratorMiddleware } = require("./Middleware");

const {handleLogIn} = require("../services/login/LogInService");

const router = express.Router()

const {SIGN_IN_URL} = require("../constants/URLs");

router.post(SIGN_IN_URL,
    async (req, res, next) => {
        await administratorMiddleware(req, res, next)
    },
    async (req, res) => {
        Logger.request(SIGN_IN_URL);

        await handleLogIn(req, res);
    } );

module.exports = router;
