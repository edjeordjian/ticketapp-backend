const cors = require('cors');

const express = require('express');

const bodyParser = require("body-parser");

const {database} = require("../../data/database/database");

const logInRoutes = require("../../routes/login/LogInRoutes");

const eventRoutes = require("../../routes/events/EventRoutes");

const {defineRelationships} = require("../../data/database/relationships");

const {logInfo, logError, setLevel} = require("../helpers/Logger");

const {PORT_LBL} = require("../../constants/app/appConstants");

const {NODE_PORT, LOG_LEVEL} = require("../../constants/generalConstants");

const {runMigrations} = require("../../data/migrations/migrations");

const {IS_PRODUCTION} = require("../../constants/dataConstants");

const {BASE_URL} = require("../../constants/URLs");

const {RESET_DATABASE} = require("../../constants/dataConstants");

const syncDB = async () => {
    defineRelationships();

    // "sync()" creates the database table for our model(s),
    // if we make .sync({force: true}),
    // the DB is dropped first if it is already existed
    await database.sync( {
        force: RESET_DATABASE
    } ).then(async _ => {
        if (IS_PRODUCTION) {
            await runMigrations();
        }
    }).then(async _ => {
        await database.sync();
    });
};

const app = express();

app.use( cors() );

app.use( bodyParser.json() );

app.use(BASE_URL, logInRoutes);

app.use(BASE_URL, eventRoutes);

setLevel(LOG_LEVEL);

syncDB().then( () => {
        app.listen(NODE_PORT, () => {
            logInfo(`${PORT_LBL} ${NODE_PORT}`);
        } );
    } )
    .catch( (error) => {
        logError(error);
    } );
