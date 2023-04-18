const { database } = require("../database/database");

const Sequelize = require("sequelize");

const { Speakers } = require("../model/Speakers");

const { ID_MAX_LEN } = require("../../constants/dataConstants");

const queryInterface = database.getQueryInterface();

const { RUNNING_MIGRATIONS_LBL } = require("../../constants/dataConstants");

const { logInfo } = require("../../services/helpers/Logger");

const { User } = require("../model/User");

const { MAX_STR_LEN, MAX_STR_CAPACITY } = require("../../constants/dataConstants");

const { Events } = require("../model/Events");

const { EventTypes } = require("../model/EventTypes");

const today = new Date();

async function runMigrations () {
    logInfo(RUNNING_MIGRATIONS_LBL);

    await queryInterface.addColumn(Events.tableName,
        "latitude", {
            type: Sequelize.STRING(MAX_STR_LEN)
        }
    ).catch(error => console.log(error.toString()));

    await queryInterface.addColumn(Events.tableName,
        "longitude", {
            type: Sequelize.STRING(MAX_STR_LEN)
    }).catch(error => console.log(error.toString()));

    await queryInterface.bulkInsert(EventTypes.tableName, [{
        name: "Evento deportivo",
        createdAt: today,
        updatedAt: today
    },
        {
            name: "Cena o gala",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Clase, curso o taller",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Concierto",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Performance",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Conferencia",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Encuentro",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Networking",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Feria",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Festival",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Fiesta",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Competencia",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Promoción",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Seminario",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Show",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Torneo",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Visita",
            createdAt: today,
            updatedAt: today
        },
        {
            name: "Otro",
            createdAt: today,
            updatedAt: today
        }
    ]);
}

module.exports = {
    runMigrations
};
