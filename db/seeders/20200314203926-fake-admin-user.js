const chalk = require('chalk');
const { User } = require('..');
const { generateAdmin } = require('../../utils/generateData');

const { log } = console;

const FAKE_ADMIN = 'fakeAdmin';

module.exports = {
  up: async () => {
    const admin = generateAdmin(FAKE_ADMIN);
    await User.create(admin);
    log(chalk.green('Admin user created, user details:'));
    log(chalk.green('name:'), admin.name);
    log(chalk.green('email:'), admin.email);
    log(chalk.green('password:'), admin.password);
    log(chalk.green('role:'), admin.role);
    log(chalk.red('Note: You prefer to keep those to yourself.'));
  },

  down: async () => {
    const deleted = await User.destroy({ name: FAKE_ADMIN });
    if (!deleted) {
      log(chalk.red(`Failed to delete user: ${FAKE_ADMIN}`));
    } else {
      log(chalk.green(`User ${FAKE_ADMIN} deleted successfully`));
    }
  }
};
