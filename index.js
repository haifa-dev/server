const { log, error } = console;

process.on('uncaughtException', (err) => {
  log('::Uncaught Exception::');
  log(err);
});

const server = require('./server');

module.exports = server();

process.on('unhandledRejection', (err) => {
  log('::Unhandled Rejection::');
  error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
