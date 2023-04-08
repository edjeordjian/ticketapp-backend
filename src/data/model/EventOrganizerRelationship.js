const { Events } = require('./Events');

const { User } = require('./User');

const defineEventOrganizerRelationship = () => {
  User.hasMany(Events, {
    foreignKey: 'owner_id',
  });

  Events.belongsTo(User, {
    foreignKey: 'owner_id'
  });
}

module.exports = {
  defineEventOrganizerRelationship,
};
