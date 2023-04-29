const { MAX_STR_LEN } = require("../../constants/dataConstants");

const { database } = require("../database/database");

const { Sequelize } = require("sequelize");

const EventTypes = database.define("event_types", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { notEmpty: true },
        unique: true,
        autoIncrement: true
    },

    name: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

const getSerializedEventType = (e) => {
    return {
        id: e.id,

        name: e.name
    };
};

module.exports = {
    EventTypes, getSerializedEventType
};
