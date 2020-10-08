module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    return queryInterface.createTable('profitable_project_reqs', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      business_plan: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      system_definition: {
        type: Sequelize.STRING,
        allowNull: false
      },
      community_or_profit: {
        type: Sequelize.ENUM,
        values: ['community', 'profit']
      },
      is_funded: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        defaultValue: Sequelize.literal('now()'),
        type: Sequelize.DATE
      },
      updated_at: {
        defaultValue: Sequelize.literal('now()'),
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('profitable_project_reqs');
  }
};
