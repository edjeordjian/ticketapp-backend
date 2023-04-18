const { CREATED_EVENTS_RELATION_NAME } = require("../../constants/dataConstants");

const { ORGANIZER_RELATION_NAME } = require("../../constants/dataConstants");

const { Events } = require('./Events');

const { User } = require('./User');

const defineEventOrganizerRelationship = () => {
  User.hasMany(Events, {
    foreignKey: 'owner_id',
    as: CREATED_EVENTS_RELATION_NAME
  });

  Events.belongsTo(User, {
    foreignKey: 'owner_id',
    as: ORGANIZER_RELATION_NAME
  });
}

module.exports = {
  defineEventOrganizerRelationship,
};
