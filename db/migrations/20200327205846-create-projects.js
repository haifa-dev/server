module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('projects', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 255],
          notEmpty: true,
          notNull: true
        }
      },
      description: { type: Sequelize.TEXT, validate: { notEmpty: true } },
      image: {
        type: Sequelize.STRING,
        defaultValue: 'default/project.jpg'
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
    return queryInterface.dropTable('projects');
  }
};
