const { Sequelize } = require('sequelize');
const { database, env, DATABASE_HOST } = require('./env');
const { query } = require('../utils/log');

// sequelize database connection configuration
module.exports = new Sequelize(...Object.values(database), {
  host: DATABASE_HOST,
  dialect: 'postgres',
  logging: env.isProd ? false : query,
  define: {
    underscored: true
  }
});
