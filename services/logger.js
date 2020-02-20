const chalk = require('chalk');
const morgan = require('morgan');

const { log, error } = console;

module.exports = async (app, sequelize) => {
  if (app.get('env') === 'development')
    sequelize
      .authenticate()
      .then(() => {
        sequelize.sync({ force: true });
        log('Connection to database established successfully');
        log('Morgan enabled');
        app.use(morgan('dev'));
      })
      .catch(err => {
        error(
          `${chalk.red('Error')} Establishing a Database Connection\nError:\t{\n\ttitle: ${
            err.name
          }\n\taddress: ${err.parent.address}\n\tport: ${err.parent.port} \n}`
        );
        process.exit(1);
      });
};
