const simple_node_logger = require('simple-node-logger');

const {DATE_FORMAT} = require("../../constants/generalConstants");

const {getQuickDate} = require("./DateHelper");

const path = require('path');

const {INFO_LBL,
       DEBUG_LBL,
       WARN_LBL,
       ERROR_LBL} = require("../../constants/helpers/helpersConstants");

const logFile = path.resolve(__dirname, "")
        .replace("src/services/helpers", "")
    + "logs/" + getQuickDate() + ".log";

// If the file does not exist, it will be created.
const fileLogger = simple_node_logger.createSimpleLogger( {
    timestampFormat: DATE_FORMAT,
    logFilePath: logFile,
} );

const setLevel = (level) => {
    if (! [DEBUG_LBL, INFO_LBL, WARN_LBL, ERROR_LBL].includes(level)) {
        fileLogger.setLevel(INFO_LBL);

        fileLogger.info(`Log level: ${INFO_LBL}.`);
    } else {
        fileLogger.setLevel(level);

        fileLogger.info("Log level: " + level + ". ");
    }
};

const info = (message) => {
    fileLogger.info(message);
};

const debug = (message) => {
    fileLogger.debug(message);
};

const warn = (message) => {
    fileLogger.warn(message);
};

const error = (message) => {
    fileLogger.error(message);
};

const request = (message) => {
    info("Request en : " + message);
};

const log = (message,
             type) => {
    const logTypes = {
        INFO_LBL: info,
        DEBUG_LBL: debug,
        WARN_LBL: warn,
        ERROR_LBL: error
    }

    logTypes[type](message);
};

module.exports = {
    setLevel, info, debug, warn,
    error, request, log
};
