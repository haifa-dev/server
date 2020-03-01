const { Sequelize } = require('sequelize');
const chalk = require('chalk');

const { NODE_ENV: env } = process.env;
const { log } = console;

module.exports = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
    logging:
      env === 'development' || env === undefined
        ? query => {
            log(chalk.cyan(`\n${query}\n`));
          }
        : false,
    define: {
      underscored: true
    }
  }
);
