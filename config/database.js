const { Sequelize } = require('sequelize');
const chalk = require('chalk');

const { log, error } = console;

const sequelize = new Sequelize(
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

sequelize
  .authenticate()
  .then(() => log('Connection to database established successfully'))
  .catch(err => {
    error(
      `${chalk.red('Error')} Establishing a Database Connection\nError:\t{\n\ttitle: ${
        err.name
      }\n\taddress: ${err.parent.address}\n\tport: ${err.parent.port} \n}`
    );
    process.exit(1);
  });

// sequelize.sync({ force: true });

module.exports = sequelize;
