require('dotenv').config();

const { DATABASE, DATABASE_PASSWORD, DATABASE_USERNAME, DATABASE_HOST } = process.env;

const DATABASE_CONFIG = {
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE,
  host: DATABASE_HOST || 'localhost',
  port: 5432,
  dialect: 'postgres'
};

module.exports = {
  development: DATABASE_CONFIG,
  test: { ...DATABASE_CONFIG, database: `${DATABASE}-test` },
  production: DATABASE_CONFIG
};
