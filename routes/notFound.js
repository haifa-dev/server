const AppError = require('../utils/AppError');
const { removeImg } = require('../utils/fsManipulations');

module.exports = (req, res, next) => {
  if (req.file) {
    removeImg(req.file.path);
  }
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
};
