const {database} = require('../database/database');

const Sequelize = require('sequelize');

const {Users} = require("../model/Users");

const queryInterface = database.getQueryInterface();

async function runMigrations() {
}

module.exports = {
    runMigrations
}
