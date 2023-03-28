const Logger = require("../../services/helpers/Logger");

const express = require('express')

const router = express.Router()

const LoginService = require("../../services/login/LogInService");

const {SIGN_IN_URL} = require("../../constants/URLs");

router.post(SIGN_IN_URL, async (req, res) => {
    Logger.request(SIGN_IN_URL);

    await LoginService.handleLogIn(req, res);
} );

module.exports = router;
