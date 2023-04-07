const {timeToString} = require("../../services/helpers/DateHelper");

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
    const pictures = [];

    if (e.wallpaperUrl) {
        pictures.push(e.wallpaperUrl);
    }

    if (e.picture1Url) {
        pictures.push(e.picture1Url);
    }

    if (e.picture2Url) {
        pictures.push(e.picture2Url);
    }

    if (e.picture3Url) {
        pictures.push(e.picture3Url);
    }

    if (e.picture4Url) {
        pictures.push(e.picture4Url);
    }

    return {
        id: e.id,

        name: e.name,

        description: e.description,

        capacity: e.capacity,

        date: dateToString(e.date),

        time: timeToString(e.time),

        address: e.address,

        pictures: pictures,

        types_ids: e.event_types.map(type => type.id),

        agenda: e.speakers.map(speaker => {
            return {
                "start": speaker.start,

                "end": speaker.end,

                "title": speaker.title
            }
        })
    }
};

module.exports = {
    Events, getSerializedEvent
};
