const { log, error } = console;
const PORT = process.env.PORT || 5000;

process.on('uncaughtException', err => {
  error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  error('Unhandled Rejection:', err);
  process.exit(1);
});

const app = require('express')();
// load environment variables
require('dotenv').config({ debug: true });
// database initialization
const sequelize = require('./config/sequelize');
// logging database queries and http requests
require('./services/logger')(app, sequelize);
// routes
require('./routes')(app);
// ::WARNING:: IF YOU CHANGE PORT ADJUST PACKAGE.JSON share script accordingly
const server = app.listen(PORT, () => log(`Listening on port ${PORT}`));

module.exports = server;
