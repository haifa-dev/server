const { generateAdmin } = require('../../utils/generateData');
const { success } = require('../../utils/log');

const adminUser = generateAdmin();

module.exports = {
  up: queryInterface => {
    success('root user details:');
    success('email:', adminUser.email);
    success('password:', adminUser.password);

    return queryInterface.bulkInsert('users', [adminUser], {});
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
