const ServerError = require('../utils/ServerError');

module.exports = (req, res, next) =>
  next(new ServerError(`Can't find ${req.originalUrl} on this server.`, 404));
