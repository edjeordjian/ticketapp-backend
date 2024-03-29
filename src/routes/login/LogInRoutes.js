const Logger = require("../../helpers/Logger");

const express = require('express');

const { administratorMiddleware } = require("../authentication/Middleware");

const {handleLogIn} = require("../../services/login/LogInService");

const {SIGN_IN_URL} = require("../../constants/URLs");

const router = express.Router();

router.post(SIGN_IN_URL,
    async (req, res, next) => {
        await administratorMiddleware(req, res, next, true)
    },
    async (req, res) => {
        Logger.request(SIGN_IN_URL);

        await handleLogIn(req, res);
    } );

module.exports = router;
