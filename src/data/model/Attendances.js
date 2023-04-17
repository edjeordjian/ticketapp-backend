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
    through: Attendances
});

User.belongsToMany(Events, {
    through: Attendances
})

module.exports = {
    Attendances
};
