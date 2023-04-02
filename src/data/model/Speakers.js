const {ID_MAX_LEN, MAX_STR_LEN} = require("../../constants/dataConstants");

const {Sequelize} = require("sequelize");

const {database} = require("../database/database");

const Speakers = database.define("speakers", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { notEmpty: true },
        unique: true,
        autoIncrement: true
    },

    description: {
        type: Sequelize.STRING(MAX_STR_LEN)
    },


    time: {
        type: Sequelize.STRING(MAX_STR_LEN)
    }
});

module.exports = {
    Speakers
};
