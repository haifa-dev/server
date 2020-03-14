const server = require('./server');

const { error } = console;

module.exports = server();

process.on('uncaughtException', err => {
  error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  error('Unhandled Rejection:', err);
  process.exit(1);
});
