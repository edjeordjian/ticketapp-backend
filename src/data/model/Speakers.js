const {MAX_STR_LEN} = require("../../constants/dataConstants");

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

    title: {
        type: Sequelize.STRING(MAX_STR_LEN)
    },

    start: {
        type: Sequelize.STRING(MAX_STR_LEN)
    },

    end: {
        type: Sequelize.STRING(MAX_STR_LEN)
    }
});

module.exports = {
    Speakers
};
