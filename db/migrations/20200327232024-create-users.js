module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true, notNull: true, notEmpty: true, len: [3, 255] }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [1, 255], notNull: true }
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: 'unknown',
        validate: { len: [1, 255] }
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'user',
        validate: {
          isIn: [['user', 'guide', 'lead-guide', 'admin']]
        }
      },
      reset_token: {
        type: Sequelize.STRING
      },
      reset_token_expires: {
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('users');
  }
};
