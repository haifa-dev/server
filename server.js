require('dotenv').config({ debug: true });

const chalk = require('chalk');
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { errorHandler } = require('./middleware');
const { router, notFound } = require('./routes');
const sequelize = require('./config/sequelize');

const { log } = console;

module.exports = async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  log(chalk.green('Database connection established successfully'));

  const app = express();
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(express.json({ limit: 52428800 }));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(cors());
  app.options('*', cors());
  app.use('/api/v1', router);
  app.use('*', notFound);

  // ::WARNING:: IF YOU CHANGE PORT ADJUST PACKAGE.JSON share script accordingly
  const PORT = process.env.PORT || 5000;

  app.use(errorHandler);

  return app.listen(PORT, () => log(`Listening on port ${PORT}`));
};
