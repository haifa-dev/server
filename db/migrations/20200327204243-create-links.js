module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('links', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      linkable_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { len: [1, 255], notEmpty: true, notNull: true }
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { len: [1, 255], notEmpty: true, notNull: true, isUrl: true }
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
    return queryInterface.dropTable('links');
  }
};
