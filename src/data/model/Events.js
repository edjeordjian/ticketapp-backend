const {MAX_STR_CAPACITY} = require("../../constants/dataConstants");

const { Sequelize } = require("sequelize");

const { MAX_STR_LEN } = require("../../constants/dataConstants");

const { database } = require("../database/database");

const { User } = require('./User');

const Events = database.define("events", {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { notEmpty: true },
        unique: true,
        autoIncrement: true
    },

    owner_id: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        references: {
            model: User,
            key: 'id'
        }
    },

    name: {
        type: Sequelize.STRING(MAX_STR_LEN),
        allowNull: false,
        validate: { notEmpty: true }
    },

    description: {
        type: Sequelize.STRING(MAX_STR_CAPACITY)
    },

    capacity: {
        type: Sequelize.INTEGER
    },

    date: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: { notEmpty: true }
    },

    address: {
        type: Sequelize.STRING(MAX_STR_LEN)
    },

    wallpaper_url: {
        type: Sequelize.STRING(MAX_STR_LEN)
    },

    picture1_url: {
        type: Sequelize.STRING(MAX_STR_LEN)
    },

    picture2_url: {
        type: Sequelize.STRING(MAX_STR_LEN)
    },

    picture3_url: {
        type: Sequelize.STRING(MAX_STR_LEN)
    },

    picture4_url: {
        type: Sequelize.STRING(MAX_STR_LEN)
    }
});

User.hasMany(User, {
    foreignKey: "ownerId"
});

module.exports = {
    Events
};
