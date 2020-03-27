module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('dev_profiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { len: [1, 255], notEmpty: true, notNull: true }
      },
      image: { type: Sequelize.STRING },
      bio: { type: Sequelize.TEXT },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          notNull: true,
          notEmpty: true,
          len: [3, 255]
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
    return queryInterface.dropTable('dev_profiles');
  }
};
