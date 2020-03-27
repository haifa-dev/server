module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('events', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      date: {
        type: Sequelize.DATE,
        validate: {
          isAfter: Sequelize.NOW
        }
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { len: [1, 255], notEmpty: true, notNull: true }
      },
      description: {
        type: Sequelize.TEXT,
        validate: { notEmpty: true }
      },
      location: { type: Sequelize.STRING },
      image: {
        type: Sequelize.STRING,
        defaultValue: 'default/event.jpg'
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
    return queryInterface.dropTable('events');
  }
};
