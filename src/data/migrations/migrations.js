const { database } = require("../database");

const Sequelize = require("sequelize");

const { ID_MAX_LEN } = require("../../constants/dataConstants");

const queryInterface = database.getQueryInterface();

const { RUNNING_MIGRATIONS_LBL } = require("../../constants/dataConstants");

const { logInfo } = require("../../helpers/Logger");

const { MAX_STR_LEN, MAX_STR_CAPACITY } = require("../../constants/dataConstants");

const { EventReportCategory } = require("../model/EventReportCategory");

const { Speakers } = require("../model/Speakers");

const { User } = require("../model/User");

const { Events } = require("../model/Events");

const { EventTypes } = require("../model/EventTypes");

const { EventState } = require("../model/EventState");

const { EventReport } = require("../model/EventReport");

const today = new Date();

async function runMigrations() {
    logInfo(RUNNING_MIGRATIONS_LBL);

    await queryInterface.addColumn(Events.tableName,
        'total_capacity',
        {
            type: Sequelize.INTEGER
        }).catch(error => console.log(error.toString()));
}

module.exports = {
    runMigrations
};
