const { ID_MAX_LEN } = require("../../constants/dataConstants");

const { Sequelize } = require("sequelize");

const { database } = require("../database");

const EventCalendarSchedule = database.define("event_calendar_schedule", {
    schedule_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = {
    EventCalendarSchedule
};
