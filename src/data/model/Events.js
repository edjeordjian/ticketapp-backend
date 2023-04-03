const {MAX_STR_CAPACITY} = require("../../constants/dataConstants");

const { Sequelize } = require("sequelize");

const { MAX_STR_LEN } = require("../../constants/dataConstants");

const { database } = require("../database/database");

const { User } = require('./User');

const { dateToString } = require("../../services/helpers/DateHelper");

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

    time: {
        type: Sequelize.DATE
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

const getSerializedEvent = (e) => {
    return {
        id: e.id,

        name: e.name,

        description: e.description,

        capacity: e.capacity,

        date: dateToString(e.date),

        address: e.address,

        wallpaper_url: e.wallpaperUrl,

        picture1_url: e.picture1Url,

        picture2_url: e.picture2Url,

        picture3_url: e.picture3Url,

        picture4_url: e.picture4Url,

        types_ids: e.event_types.map(type => type.id),

        agenda: e.speakers.map(speaker => {
            return {
                "description": speaker.description,

                "time": speaker.time
            }
        })
    }
};

module.exports = {
    Events, getSerializedEvent
};
