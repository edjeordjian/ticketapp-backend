const { Sequelize, DataTypes } = require("sequelize");

const { ID_MAX_LEN, MAX_STR_LEN } = require("../../constants/dataConstants");

const { database } = require("../database/database");

const Group = database.define("groups", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    organizer_email: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        unique: true
    }

});

module.exports = {
    Group
};
