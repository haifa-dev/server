const { success, failure } = require('../utils/log');
const sequelize = require('./sequelize');

/**
 * initialize and validate sequelize connection
 */
module.exports = async () => {
  try {
    await sequelize.authenticate();
    success('database connection established');
  } catch (err) {
    failure('database connection failed\n', err);
    process.exit(1);
  }
};
