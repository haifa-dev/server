const morgan = require('morgan');

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app => {
  if (app.get('env') === 'development') {
    console.log('Morgan enabled');
    app.use(morgan('dev'));
  }
};
