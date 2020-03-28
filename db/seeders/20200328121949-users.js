const chalk = require('chalk');
const { generateAdmin } = require('../../utils/generateData');

const { log } = console;
const adminUser = generateAdmin();

module.exports = {
  up: queryInterface => {
    log(chalk.green('root user details:'));
    log(chalk.green('email:'), adminUser.email);
    log(chalk.green('password:'), adminUser.password);

    return queryInterface.bulkInsert('users', [adminUser], {});
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
