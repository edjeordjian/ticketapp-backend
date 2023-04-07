const IS_PRODUCTION = process.env.PRODUCTION !== undefined;
if (!IS_PRODUCTION && process.env.MY_ENV === undefined) {
  process.env.MY_ENV = ".development";
}

require("dotenv").config({
  path: `.env${process.env.MY_ENV}`,
});

const fs = require("fs");

const { TEST_ENV } = require("./generalConstants");

const { TEST_URL } = require("./generalConstants");

const RESET_DATABASE = false;

let DATABASE_URL;

let DB_USER;

let DB_PASSWORD;

let DB_HOST;

let DB_PORT;

let DB_NAME;

if (process.env.MY_ENV === TEST_ENV) {
  DATABASE_URL = TEST_URL;
} else if (!IS_PRODUCTION) {
  if (process.env.DATABASE_URL === undefined) {
    DB_USER = process.env.POSTGRES_USER;
    DB_PASSWORD = process.env.POSTGRES_PASSWORD;
    DB_HOST = process.env.DB_HOST;
    DB_PORT = process.env.DB_PORT;
    DB_NAME = process.env.DB_NAME;

    // DATABASE_URL=${DB}://${POSTGRES_USER}:${POSTGRES_PASSWORD}
    //              @${DB_CONTAINER_NAME}:${DB_PORT}/${POSTGRES_DB}
    DATABASE_URL = `${process.env.DB}`
      .concat(`://${DB_USER}`)
      .concat(`:${DB_PASSWORD}`)
      .concat(`@${DB_HOST}`)
      .concat(`:${DB_PORT}`)
      .concat(`/${DB_NAME}`);
  } else {
    DATABASE_URL = process.env.DATABASE_URL;
  }
} else {
  DATABASE_URL = process.env.DATABASE_URL;
}

const ID_MAX_LEN = 60;

const MAX_STR_LEN = 254;

const MAX_STR_CAPACITY = 65500;

const path = "./file.txt";

let FIREBASE_CONFIG;

try {
  if (fs.existsSync(path)) {
    FIREBASE_CONFIG = require("../../firebase-admin.json");
  }
} catch (err) {
  //Testing environment
  FIREBASE_CONFIG = {};
}

const RUNNING_MIGRATIONS_LBL = "Running migrations...";

module.exports = {
  RESET_DATABASE,
  DATABASE_URL,
  IS_PRODUCTION,
  ID_MAX_LEN,
  MAX_STR_LEN,
  FIREBASE_CONFIG,
  RUNNING_MIGRATIONS_LBL,
  MAX_STR_CAPACITY,
};
