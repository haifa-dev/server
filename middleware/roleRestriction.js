const AppError = require('../utils/AppError');

module.exports = (...role) => {
  return (req, res, next) => {
    try {
      if (!role.includes(req.user.role)) throw new AppError('Access denied.', 403);
      next();
    } catch (ex) {
      next(ex);
    }
  };
};
