const { database, DATABASE_HOST } = require('./env');

// sequelize-cli database connection configuration
const connection = {
  ...database,
  dialect: 'postgres',
  host: DATABASE_HOST
};

module.exports = {
  development: connection,
  test: connection,
  production: connection
};
