require('dotenv').config({
    path: `.env${process.env.MY_ENV}`
});

const NODE_PORT = process.env.PORT;

const FRONT_HOST = process.env.FRONT_HOST;

const DATE_FORMAT = "YYYY-M-D H:mm:ss.SS";

const LOG_LEVEL = "debug";

module.exports = {
    DATE_FORMAT, LOG_LEVEL, NODE_PORT, FRONT_HOST
};
