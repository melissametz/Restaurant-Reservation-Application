/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require("dotenv").config();
const path = require("path");

const {
  DATABASE_URL = "postgres://zsagzomw:OVj3SZZECGl5nZtuURTqa1CEiPJnc5rK@kashin.db.elephantsql.com/zsagzomw",
  DATABASE_URL_DEVELOPMENT = "postgres://golzvmxv:2KhZawh5hWitDSSE3Uo8qoRe8kgwsfDL@kashin.db.elephantsql.com/golzvmxv",
  DATABASE_URL_TEST = "postgres://jiyttebj:t4cQ-e_zNQNO6m7NVDRXbkgheKAJIWOR@kashin.db.elephantsql.com/jiyttebj",
  DATABASE_URL_PREVIEW = "postgres://yctngnug:0T34-f_8XkczCCId6NQ01EwTFXyeQIZI@kashin.db.elephantsql.com/yctngnug",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
