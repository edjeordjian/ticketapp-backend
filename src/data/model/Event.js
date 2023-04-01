const { Sequelize } = require("sequelize");

const { ID_MAX_LEN, MAX_STR_LEN } = require("../../constants/dataConstants");

const { database } = require("../database/database");

const Event = database.define("events", {
    id: {
        primaryKey: true,
        type: Sequelize.STRING(ID_MAX_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        unique: true
    },
    name: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        unique: true
    },
    date: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: { notEmpty: true }
    },
    ownerId: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        references: {
            model: User,
            key: 'id'
        }
    }
});
User.hasMany(User, { foreignKey: "ownerId" })

module.exports = {
    Event
};
