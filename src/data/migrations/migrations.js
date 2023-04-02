const {database} = require('../database/database');

const Sequelize = require('sequelize');
const {ID_MAX_LEN} = require("../../constants/dataConstants");

const queryInterface = database.getQueryInterface();

const {RUNNING_MIGRATIONS_LBL} = require("../../constants/dataConstants");

const {logInfo} = require("../../services/helpers/Logger");

const {User} = require("../model/User");

const {MAX_STR_LEN, MAX_STR_CAPACITY} = require("../../constants/dataConstants");

const {EventTypes} = require("../model/EventTypes");

const today = new Date();

async function runMigrations() {
    logInfo(RUNNING_MIGRATIONS_LBL);

    await queryInterface.addColumn(User.tableName,
        "is_administrator", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            validate: { notEmpty: true }
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "is_organizer", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            validate: { notEmpty: true }
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "is_consumer", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            validate: { notEmpty: true }
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "first_name", {
            type: Sequelize.STRING(MAX_STR_LEN),
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "last_name", {
            type: Sequelize.STRING(MAX_STR_LEN),
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "picture_url", {
            type: Sequelize.STRING(MAX_STR_LEN),
        }
    ).catch(error => {
        console.log(error.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "ownerId", {
            type: Sequelize.STRING(ID_MAX_LEN),
        }
    ).catch(error => {
        console.log(error.toString());
    });

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
