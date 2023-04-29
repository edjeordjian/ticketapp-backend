const { MAX_STR_CAPACITY } = require("../../constants/dataConstants");

const { database } = require("../database/database");

const { Sequelize } = require("sequelize");

const EventReport = database.define("event_report", {
    text: Sequelize.STRING(MAX_STR_CAPACITY)
});

module.exports = {
    EventReport
};
