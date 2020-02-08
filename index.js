const express = require('express');

const app = express();

// handle uncaught expectations and integrate loggers.
require('./services/logger')(app);
// load environment variables
require('dotenv').config();
// database initialization
require('./config/database')();
// routes
require('./routes')(app);
// ::WARNING:: IF YOU CHANGE PORT ADJUST PACKAGE.JSON
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`); // eslint-disable-line
});

module.exports = server;
