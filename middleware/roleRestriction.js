const ServerError = require('../utils/ServerError');

module.exports = (...role) => {
  return (req, res, next) => {
    try {
      if (!role.includes(req.user.role)) throw new ServerError('Access denied.', 403);
      next();
    } catch (ex) {
      next(ex);
    }
  };
};
