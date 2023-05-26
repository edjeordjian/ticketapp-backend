const { User } = require("../User");

const { Events } = require('../Events');

const { EventCalendarSchedule } = require("../EventCalendarSchedule");

const defineEventRelationWithEventSchedule = () => {
    User.hasMany(EventCalendarSchedule);

    EventCalendarSchedule.belongsTo(User);

    Events.hasMany(EventCalendarSchedule);

    EventCalendarSchedule.belongsTo(Events);
};

module.exports = {
    defineEventRelationWithEventSchedule
};
