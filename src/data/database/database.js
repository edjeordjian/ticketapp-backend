const Sequelize = require('sequelize');

const dataConstants = require("../../constants/dataConstants");

const database = new Sequelize(dataConstants.DATABASE_URL, {
    dialect: 'postgres',

    logging: false,

    operatorsAliases: Sequelize.Op,

    define: {
        timestamp: false
    },

    ssl: dataConstants.IS_PRODUCTION ? {
        rejectUnauthorized: false
    } : false,

    pool: {
        max: 100,
        min: 0,
        idle: 200000,
        acquire: 1000000
    },

    dialectOptions: {
        ssl: dataConstants.IS_PRODUCTION ? {
            require: true,
            rejectUnauthorized: false
        } : false
    },
} );

module.exports = {
    database
};
