const Logger = require("../helpers/Logger");

const express = require('express')

const {handleLogIn} = require("../services/login/LogInService");

const router = express.Router()

const {SIGN_IN_URL} = require("../constants/URLs");

router.post(SIGN_IN_URL, async (req, res) => {
    Logger.request(SIGN_IN_URL);

    await handleLogIn(req, res);
} );

module.exports = router;
