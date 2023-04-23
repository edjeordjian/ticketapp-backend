const { EventTypes } = require("./EventTypes");

const { Group } = require("./Group");

const { User } = require("./User");

const { Sequelize } = require("sequelize");

const { database } = require("../database/database");

// https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/
const defineGroupGroupParticipantRelationship = () => {
    const Group_GroupParticipant = database.define("group_group_participant", {
    });

    Group.belongsToMany(User, {
        through: Group_GroupParticipant
    });

    User.belongsToMany(Group, {
        through: Group_GroupParticipant
    });
};

module.exports = {
    defineGroupGroupParticipantRelationship
};
