const { timeToString } = require("../../helpers/DateHelper");

const { MAX_STR_CAPACITY } = require("../../constants/dataConstants");

const { Sequelize } = require("sequelize");

const { MAX_STR_LEN } = require("../../constants/dataConstants");

const { database } = require("../database/database");

const { dateToString } = require("../../helpers/DateHelper");

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
        validate: { notEmpty: true }
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

    latitude: {
        type: Sequelize.STRING(MAX_STR_LEN)
    },

    longitude: {
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

const getTicket = (e, userId) => {
    const attendances = e.attendees
                         .filter(attendee => attendee.id === userId);

    if (attendances.length > 0) {
        const attendance = attendances[0].attendances;

        return {
            id: attendance.hash_code,
            wasUsed: attendance.attended
        }
    }

    return {};
}

const getSerializedEvent = async (e, userId = null) => {
    const pictures = [];

    if (e.wallpaper_url) {
        pictures.push(e.wallpaper_url);
    }

    if (e.picture1_url) {
        pictures.push(e.picture1_url);
    }

    if (e.picture2_url) {
        pictures.push(e.picture2_url);
    }

    if (e.picture3_url) {
        pictures.push(e.picture3_url);
    }

    if (e.picture4_url) {
        pictures.push(e.picture4_url);
    }

    const owner = await e.getOrganizer();

    let ticket = {}

    if (userId) {
        ticket = getTicket(e, userId);
    }

    return {
        id: e.id,

        name: e.name,

        description: e.description,

        capacity: e.capacity,

        date: dateToString(e.date),

        time: timeToString(e.time),

        address: e.address,

        latitude: e.latitude,

        longitude: e.longitude,

        pictures: pictures,

        types_ids: e.event_types.map(type => type.id),

        types_names: e.event_types.map(type => type.name),

        organizerName: `${owner.first_name} ${owner.last_name}`,

        agenda: e.speakers ? e.speakers.map(speaker => {
            return {
                "start": speaker.start,

                "end": speaker.end,

                "title": speaker.title
            }
        }) : [],

        faq: e.FAQs ? e.FAQs.map(faq => {
            return {
                "question": faq.question,
                "answer": faq.answer
            }
        }) : [],

        ticket: ticket
    }
};

module.exports = {
    Events, getSerializedEvent, getTicket
};
