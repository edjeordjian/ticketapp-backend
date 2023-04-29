const { database } = require("../database/database");

const Sequelize = require("sequelize");

const { Speakers } = require("../model/Speakers");

const { ID_MAX_LEN } = require("../../constants/dataConstants");

const queryInterface = database.getQueryInterface();

const { RUNNING_MIGRATIONS_LBL } = require("../../constants/dataConstants");

const { logInfo } = require("../../helpers/Logger");

const { User } = require("../model/User");

const { MAX_STR_LEN, MAX_STR_CAPACITY } = require("../../constants/dataConstants");

const { Events } = require("../model/Events");

const { EventTypes } = require("../model/EventTypes");

const today = new Date();

async function runMigrations () {
    logInfo(RUNNING_MIGRATIONS_LBL);

    await queryInterface.addColumn(Users.tableName,
        "expo_token",
        {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(err => {
       console.log(err.toString());
    });
}

module.exports = {
    runMigrations
};
