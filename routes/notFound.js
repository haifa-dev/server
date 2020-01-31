const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
};
