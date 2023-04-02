const { Sequelize } = require("sequelize");

const { ID_MAX_LEN, MAX_STR_LEN } = require("../../constants/dataConstants");

const { database } = require("../database/database");

const { User } = require("./User");

const { Event } = require("./Events");

const Attendances = database.define("attendances", {
    id: {
        primaryKey: true,
        type: Sequelize.STRING(ID_MAX_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        unique: true
    },
    userId: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        unique: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    eventId: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        references: {
            model: Event,
            key: 'id'
        }
    }
});

Attendance.belongsTo(Event, {
    foreignKey: 'eventId',
});

Attendance.belongsTo(User, {
    foreignKey: 'userId',
});

Event.hasMany(Attendance, {
    foreignKey: 'eventId',
});

User.hasMany(Attendance, {
    foreignKey: 'userId',
});

module.exports = {
    Attendances
};
