const {Sequelize} = require("sequelize");

const {ID_MAX_LEN, MAX_STR_LEN} = require("../../constants/dataConstants");

const {database} = require("../database/database");

const Users = database.define("users", {
    id: {
        primaryKey: true,
        type: Sequelize.STRING(ID_MAX_LEN),
        allowNull: false,
        validate: {notEmpty: true},
        unique: true
    },

    email: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: {notEmpty: true},
        unique: true
    },

    isAdministrator: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {notEmpty: true}
    },

    isOrganizer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {notEmpty: true}
    },

    isConsumer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {notEmpty: true}
    }
} );

module.exports = {
    Users
};
