require('dotenv').config({ debug: true });

const crypto = require('crypto');

const randomKey = crypto.randomBytes(32).toString('hex');

const {
  NODE_ENV,
  DATABASE_HOST,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  SECRET_KEY
} = process.env;

const APP_SECRET_KEY = SECRET_KEY || randomKey;

const env = {
  isTest: NODE_ENV === 'test',
  isProd: NODE_ENV === 'production',
  isDev: !NODE_ENV || NODE_ENV === 'development'
};

const PORT = process.env.PORT || 5000;

const databaseName = DATABASE_NAME || 'haifa-dev';
const database = {
  database: env.isTest ? `${databaseName}-test` : databaseName,
  username: DATABASE_USERNAME || 'postgres',
  password: DATABASE_PASSWORD || 'postgres'
};

module.exports = {
  env,
  PORT,
  DATABASE_HOST,
  database,
  APP_SECRET_KEY
};
