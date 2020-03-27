module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('project_reqs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
          notNull: true,
          notEmpty: true,
          len: [3, 255]
        }
      },
      phone: {
        type: Sequelize.STRING,
        validate: {
          len: [3, 255]
        }
      },
      date: { type: Sequelize.DATE, validate: { isDate: true } },
      content: { type: Sequelize.TEXT, validate: { notEmpty: true } },
      submitted_by: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 255],
          notEmpty: true
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('project_reqs');
  }
};
