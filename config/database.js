const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    // (...msg) => console.log(msg),
    define: {
      underscored: true,
      paranoid: true
    }
  }
);

sequelize
  .authenticate()
  .then(() => console.log('Connection to database established successfully'))
  .catch(err => {
    console.error(
      `Error Establishing a Database Connection\nError:\t{\n\ttitle: ${err.name}\n\taddress: ${err.parent.address}\n\tport: ${err.parent.port} \n}`
    );
    process.exit(1);
  });

sequelize.sync({ force: true });

// sequelize.sync({ force: true });
module.exports = sequelize;
