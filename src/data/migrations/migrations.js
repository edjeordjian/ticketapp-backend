const {database} = require('../database/database');

const Sequelize = require('sequelize');

const {MAX_STR_LEN} = require("../../constants/dataConstants");

const {Users} = require("../model/Users");

const queryInterface = database.getQueryInterface();

async function runMigrations() {
    await queryInterface.addColumn(Users.tableName,
        'firstName', {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));

    await queryInterface.addColumn(Users.tableName,
        'lastName', {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));

    await queryInterface.addColumn(Users.tableName,
        'pictureUrl', {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));
}

module.exports = {
    runMigrations
}
