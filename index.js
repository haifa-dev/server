const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

const database = require('./config/database');
const { PORT, env } = require('./config/env');
const { failure, success } = require('./utils/log');
const routes = require('./routes');
const notFound = require('./routes/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const MAX_BYTES = 52428800;
const CORS_OPTIONS = {
  exposedHeaders: ['Content-Type', 'Authorization'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

/**
 * log the error description and exit the application
 * @param ex error description
 */
const handleEx = ex => {
  failure(ex);
  process.exit(1);
};

process.on('uncaughtException', handleEx);
process.on('unhandledRejection', handleEx);

module.exports = (async () => {
  await database(); // database initialize
  if (env.isDev) app.use(morgan('dev')); // setup morgan logger
  app.use(express.json({ limit: MAX_BYTES })); // json body parser
  app.use(express.static(path.join(__dirname, 'public'))); // static files parser
  app.use(cors(CORS_OPTIONS)); // allow cors origin
  app.options('*', cors(CORS_OPTIONS)); // allow cors origin for option request
  app.use('/api/v1', routes); // rest api routes
  app.use('*', notFound); // page not found error handler
  app.use(errorHandler); // error handler

  return app.listen(PORT, () => success(`listening on port ${PORT}`));
})();
