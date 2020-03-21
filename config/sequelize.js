const { Sequelize } = require('sequelize');
const chalk = require('chalk');
const { isDev } = require('./config');

const { log } = console;

module.exports = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: isDev && (query => log(chalk.cyan(`\n${query}\n`))),

    define: {
      underscored: true
    }
  }
);
