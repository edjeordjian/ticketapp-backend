const cors = require('cors');

const express = require('express');

const bodyParser = require("body-parser");

const cron = require('node-cron');

const { database } = require("./data/database");

const logInRoutes = require("./routes/login/LogInRoutes");

const eventRoutes = require("./routes/events/EventRoutes");

const userRoutes = require("./routes/users/UserRoutes");

const eventScheduleRoutes = require("./routes/events/EventCalendarScheduleRoutes");

const eventStatsRoutes = require("./routes/events/EventStats");

const { cronEventUpdate } = require("./services/events/EventService");

const { defineRelationships } = require("./data/model/relationships/relationships");

const {
    logInfo,
    logError,
    setLevel
} = require("./helpers/Logger");

const {
    PORT_LBL,
    NODE_PORT,
    LOG_LEVEL
} = require("./constants/generalConstants");

const { runMigrations } = require("./data/migrations/migrations");

const { IS_PRODUCTION } = require("./constants/dataConstants");

const { BASE_URL } = require("./constants/URLs");

const { RESET_DATABASE } = require("./constants/dataConstants");

const syncDB = async () => {
    defineRelationships();

    // "sync()" creates the database table for our model(s),
    // if we make .sync({force: true}),
    // the DB is dropped first if it is already existed
    await database.sync({
        force: RESET_DATABASE
    }).then(async _ => {
        if (IS_PRODUCTION) {
            await runMigrations();
        }
    }).then(async _ => {
        await database.sync();
    });
};

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(BASE_URL, logInRoutes);

app.use(BASE_URL, eventRoutes);

app.use(BASE_URL, userRoutes);

app.use(BASE_URL, eventStatsRoutes);

app.use(BASE_URL, eventScheduleRoutes);

setLevel(LOG_LEVEL);

// Once every minute
cron.schedule('* * * * *', cronEventUpdate);

/*
*
*  LogInService
*  |
*  ----> UserService
*        |
*        ------> EventNotificationService
*        |       |
*        |       v
*        ------> EventStateService
*
*  EventService
*  |
*  ----> FirebaseService
*  ------^
*  |
*  EventReportService
*
* */

syncDB().then(() => {
    app.listen(NODE_PORT, () => {
        logInfo(`${PORT_LBL} ${NODE_PORT}`);
    });
})
    .catch((error) => {
        logError(error);
    });
