const morgan = require('morgan');

const { log, error } = console;

process.on('uncaughtException', err => {
  error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  error('Unhandled Rejection:', err);

  // server.close(() => {
  //   error('Unhandled Rejection:', err);
  //   process.exit(1);
  // });
});

module.exports = app => {
  if (app.get('env') === 'development') {
    log('Morgan enabled');
    app.use(morgan('dev'));
  }
};
