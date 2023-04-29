require('dotenv').config({
    path: `.env${process.env.MY_ENV}`
});

const PORT_LBL = "Port: ";

const LOG_LEVEL = "debug";

const NODE_PORT = process.env.PORT;

const FRONT_HOST = process.env.FRONT_HOST;

const DATE_FORMAT = "YYYY-M-D H:mm:ss.SS";

const TEST_ENV = ".test";

const JSON_HEADER = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

module.exports = {
    DATE_FORMAT, LOG_LEVEL, NODE_PORT, FRONT_HOST,
    TEST_ENV, JSON_HEADER, PORT_LBL
};
