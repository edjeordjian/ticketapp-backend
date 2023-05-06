const { MAX_STR_LEN } = require("../../constants/dataConstants");

const { MAX_STR_CAPACITY } = require("../../constants/dataConstants");

const { database } = require("../database");

const { Sequelize } = require("sequelize");

const EventReport = database.define("event_report", {
    text: {
        type: Sequelize.STRING(MAX_STR_CAPACITY),
        allowNull: false,
        validate: { notEmpty: true },
    },
    reporter_id: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: { notEmpty: true },
    },
    event_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { notEmpty: true },
    }
});

module.exports = {
    EventReport
};
