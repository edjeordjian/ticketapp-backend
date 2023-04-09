const { database } = require('../database/database');

const Sequelize = require('sequelize');

const {Speakers} = require("../model/Speakers");

const { ID_MAX_LEN } = require("../../constants/dataConstants");

const queryInterface = database.getQueryInterface();

const { RUNNING_MIGRATIONS_LBL } = require("../../constants/dataConstants");

const { logInfo } = require("../../services/helpers/Logger");

const { User } = require("../model/User");

const { MAX_STR_LEN, MAX_STR_CAPACITY } = require("../../constants/dataConstants");

const { Events } = require("../model/Events");

const { EventTypes } = require("../model/EventTypes");

const today = new Date();

async function runMigrations() {
    logInfo(RUNNING_MIGRATIONS_LBL);

    await queryInterface.removeColumn(Speakers.tableName,
        'description')
        .catch(e => {
            console.log(e);
        } );


    await queryInterface.removeColumn(Speakers.tableName,
        'time')
        .catch(e => {
            console.log(e);
        } );


    await queryInterface.addColumn(Speakers.tableName,
        'title', {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));


    await queryInterface.addColumn(Speakers.tableName,
        'start', {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));


    await queryInterface.addColumn(Speakers.tableName,
        'end', {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(error => console.log(error.toString()));

    await queryInterface.removeColumn(User.tableName,
        '\"ownerId\"')
    .catch(e => {
        console.log(e);
    } );
}

module.exports = {
    runMigrations
}
