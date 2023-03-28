require('dotenv').config({
    path: `.env${process.env.MY_ENV}`
});

const NODE_PORT = process.env.PORT;

const FRONT_HOST = process.env.FRONT_HOST;

const DATE_FORMAT = "YYYY-M-D H:mm:ss.SS";

const LOG_LEVEL = "debug";

const TEST_ENV = ".test";

const TEST_URL = "postgres://postgres:postgres@db:5432/postgres";

module.exports = {
    DATE_FORMAT, LOG_LEVEL, NODE_PORT, FRONT_HOST,
    TEST_ENV, TEST_URL
};
