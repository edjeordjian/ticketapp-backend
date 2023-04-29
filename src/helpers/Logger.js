const simple_node_logger = require('simple-node-logger');

const {DATE_FORMAT} = require("../constants/generalConstants");

const {getQuickDate} = require("./DateHelper");

const path = require('path');

const {INFO_LBL,
       DEBUG_LBL,
       WARN_LBL,
       ERROR_LBL} = require("../constants/helpers/helpersConstants");

let logFile;
       
if (process.env.WIN){
    logFile = path.resolve(__dirname, "")
        .replace("src\\services\\helpers", "")
    + "logs\\" + getQuickDate() + ".log";
}
else{
    logFile = path.resolve(__dirname, "")
        .replace("src/services/helpers", "")
    + "logs/" + getQuickDate() + ".log";
}



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

const logInfo = (message) => {
    fileLogger.info(message);
};

const logDebug = (message) => {
    fileLogger.debug(message);
};

const logWarn = (message) => {
    fileLogger.warn(message);
};

const logError = (message) => {
    fileLogger.error(message);
};

const request = (message) => {
    logInfo("Request " + message);
};

const log = (message,
             type) => {
    const logTypes = {
        INFO_LBL: logInfo,
        DEBUG_LBL: logDebug,
        WARN_LBL: logWarn,
        ERROR_LBL: logError
    }

    logTypes[type](message);
};

module.exports = {
    setLevel, logInfo, logDebug, logWarn,
    logError, request, log
};
