const chalk = require('chalk');
const sequelize = require('./sequelize');

const { log, error } = console;

sequelize.sync({ force: true });

module.exports = async () => {
  try {
    await sequelize
      .authenticate()
      .then(() => log('Connection to database established successfully'));
  } catch (err) {
    error(
      `${chalk.red('Error')} Establishing a Database Connection\nError:\t{\n\ttitle: ${
        err.name
      }\n\taddress: ${err.parent.address}\n\tport: ${err.parent.port} \n}`
    );
    process.exit(1);
  }
};
