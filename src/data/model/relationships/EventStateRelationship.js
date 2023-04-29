const { Events } = require("../Events");

const { EventState }  = require("../EventState");

const { EVENT_STATE_RELATION_NAME } = require("../../../constants/dataConstants");

const { EVENT_TO_EVENT_STATE_RELATION_NAME } =
    require("../../../constants/dataConstants");

const defineEventStateRelationship = () => {
    EventState.hasMany(Events,
        {
            foreignKey: "state_id",
            as: EVENT_STATE_RELATION_NAME
        });

    Events.belongsTo(EventState,
        {
            foreignKey: "state_id",
            as: EVENT_TO_EVENT_STATE_RELATION_NAME
        });
};

module.exports = {
    defineEventStateRelationship
};
