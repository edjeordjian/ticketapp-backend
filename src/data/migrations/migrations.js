const {database} = require('../database/database');

const Sequelize = require('sequelize');

const {EventTypes} = require("../model/EventTypes");

const {RUNNING_MIGRATIONS_LBL} = require("../../constants/dataConstants");

const {logInfo} = require("../../services/helpers/Logger");

const {User} = require("../model/User");

const queryInterface = database.getQueryInterface();

const today = new Date();

async function runMigrations() {
    logInfo(RUNNING_MIGRATIONS_LBL);

    await queryInterface.bulkInsert(EventTypes.tableName, [{
            name: "Música",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Deporte",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Artes visuales",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Salud",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Pasatiempos",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Negocios",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Gastronomía",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Charla",
            createdAt: today,
            updatedAt: today
        }]);
}

module.exports = {
    runMigrations
}
