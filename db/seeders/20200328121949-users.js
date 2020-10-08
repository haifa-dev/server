const bcrypt = require('bcryptjs');
const { adminCredentials } = require('../../config/env');
const { generateAdmin } = require('../../utils/generateData');
const { success } = require('../../utils/log');

const adminUser = generateAdmin();

module.exports = {
  up: async queryInterface => {
    if (adminCredentials.email && adminCredentials.password) {
      adminUser.email = adminCredentials.email;
      adminUser.password = adminCredentials.password;
    }

    success('root user details:');
    success(`email:${adminUser.email}`);
    success(`password:${adminUser.password}`);

    // bulkInsert don't run sequelize hooks so we need to hash the password manually
    const salt = await bcrypt.genSalt(10);
    adminUser.password = await bcrypt.hash(adminUser.password, salt);

    return queryInterface.bulkInsert('users', [adminUser], {});
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
