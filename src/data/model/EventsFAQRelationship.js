

const { Events } = require('./Events');

const { FAQ } = require('./FAQ');

const defineEventFAQRelationship = () => {
  Events.hasMany(FAQ);

  FAQ.belongsTo(Events);
}
module.exports = {
  defineEventFAQRelationship,
};
