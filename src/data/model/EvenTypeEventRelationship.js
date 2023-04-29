const {EventTypes} = require("./EventTypes");

const {Events} = require("./Events");

const {Sequelize} = require("sequelize");

const {database} = require("../database/database");

const defineEventTypeEventRelationship = () => {
    const Event_EventType = database.define("event_event_type", {});

    Events.belongsToMany(EventTypes, {
        through: Event_EventType
    });

    EventTypes.belongsToMany(Events, {
        through: Event_EventType
    });
};

module.exports = {
    defineEventTypeEventRelationship
};
