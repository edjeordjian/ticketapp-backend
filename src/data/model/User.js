const { Sequelize } = require("sequelize");

const { ID_MAX_LEN, MAX_STR_LEN } = require("../../constants/dataConstants");

const { database } = require("../database/database");

const User = database.define("users", {
    id: {
        primaryKey: true,
        type: Sequelize.STRING(ID_MAX_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        unique: true
    },

    email: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        unique: true
    },

    is_administrator: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: { notEmpty: true },
        defaultValue: false
    },

    is_organizer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: { notEmpty: true },
        defaultValue: false
    },

    is_consumer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: { notEmpty: true },
        defaultValue: false
    },

    is_staff: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: { notEmpty: true },
        defaultValue: false
    },

    first_name: {
        type: Sequelize.STRING(MAX_STR_LEN)
    },

    last_name: {
        type: Sequelize.STRING(MAX_STR_LEN)
    },

    picture_url: {
        type: Sequelize.STRING(MAX_STR_LEN)
    },

    expo_token: {
        type: Sequelize.STRING(MAX_STR_LEN)
    }
});

module.exports = {
    User
};
