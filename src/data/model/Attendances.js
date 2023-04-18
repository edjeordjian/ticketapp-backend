const { ATTENDEES_RELATION_NAME } = require("../../constants/dataConstants");

const { EVENTS_RELATION_NAME } = require("../../constants/dataConstants");

const { ID_MAX_LEN } = require("../../constants/dataConstants");

const { Sequelize } = require("sequelize");

const { database } = require("../database/database");

const { User } = require("./User");

const { Events } = require("./Events");

const Attendances = database.define("attendances", {
    hash_code: {
        type: Sequelize.STRING(ID_MAX_LEN)
    },

    attended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

Events.belongsToMany(User, {
    through: Attendances,
    as: ATTENDEES_RELATION_NAME
});

User.belongsToMany(Events, {
    through: Attendances,
    as: EVENTS_RELATION_NAME
})

module.exports = {
    Attendances
};
