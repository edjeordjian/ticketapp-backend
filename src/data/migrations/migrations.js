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
}


async function m6() {
    await queryInterface.addColumn(Events.tableName,
        "state_id",
        {
            type: Sequelize.INTEGER
        }).catch(err => {
        console.log(err.toString());
    });

    await queryInterface.addColumn(EventReport.tableName,
        "reporter_id",
        {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(err => {
        console.log(err.toString());
    });

    await queryInterface.addColumn(User.tableName,
        "expo_token",
        {
            type: Sequelize.STRING(MAX_STR_LEN)
        }).catch(err => {
        console.log(err.toString());
    });

    await EventReportCategory.count()
        .then(async count => {
            if (count === 0) {
                await queryInterface.bulkInsert(EventReportCategory.tableName,
                    [{
                        name: "El evento parece ilegal o no cumple con nuestras políticas.",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Es publicidad / Spam, no es un evento real.",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Tiene contenido ofensivo, obsceno o discriminatorio.",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Quiere cobrar un precio a un evento gratuito.",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Otro",
                        createdAt: today,
                        updatedAt: today
                    }]);
            }
        }).catch(err => {
            console.log(err.toString());
        });

    await EventState.count()
        .then(async count => {
            if (count === 0) {
                await queryInterface.bulkInsert(EventState.tableName,
                    [{
                        name: "Borrador",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Publicado",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Cancelado",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Suspendido",
                        createdAt: today,
                        updatedAt: today
                    }, {
                        name: "Finalizado",
                        createdAt: today,
                        updatedAt: today
                    }]);
            }
        }).catch(err => {
            console.log(err.toString());
        });
}

module.exports = {
    runMigrations
};
