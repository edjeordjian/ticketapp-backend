const { Sequelize } = require("sequelize");

const { database } = require("../database");

const { MAX_STR_LEN } = require("../../constants/dataConstants");

const EventState = database.define("event_state",
    {
        name: {
            type: Sequelize.STRING(MAX_STR_LEN)
        }
    });

module.exports = {
    EventState
};
