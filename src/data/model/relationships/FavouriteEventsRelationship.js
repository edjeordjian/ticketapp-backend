const { FAVOURITE_EVENTS_RELATIONSHIP } = require("../../../constants/dataConstants");

const { Events } = require('../Events');

const { User } = require('../User');

const defineFavouriteEventsRelationship = () => {
    User.belongsToMany(Events, { as: "FavouriteEvents", through: FAVOURITE_EVENTS_RELATIONSHIP });
    Events.belongsToMany(User, { as: "FavouritedByUsers", through: FAVOURITE_EVENTS_RELATIONSHIP });
}

module.exports = {
    defineFavouriteEventsRelationship,
};
