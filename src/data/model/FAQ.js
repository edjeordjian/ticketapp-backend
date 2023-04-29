const { Sequelize } = require("sequelize");

const { MAX_STR_LEN } = require("../../constants/dataConstants");

const { database } = require("../database");
const { Events } = require("./Events")

const FAQ = database.define("FAQ", {
    eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { notEmpty: true },
        references: {
            model: Events,
            key: 'id'
        }
    },
    question: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: { notEmpty: true },
    },
    answer: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: { notEmpty: true },
    }

});

module.exports = {
    FAQ
};
