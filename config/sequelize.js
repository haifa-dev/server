const { Sequelize } = require('sequelize');
const chalk = require('chalk');

const { log } = console;

module.exports = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: query => {
      log(chalk.cyan(query));
    },
    define: {
      underscored: true
    }
  }
);
