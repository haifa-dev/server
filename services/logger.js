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
      .catch(ex => {
        error(
          `${chalk.red('Error')} Establishing a Database Connection\nError:\t{\n\ttitle: ${
            ex.name
          }\n\taddress: ${ex.parent.address}\n\tport: ${ex.parent.port} \n}`
        );
        process.exit(1);
      });
};
