const ServerError = require('../utils/ServerError');

/**
 * receive an array of roles if the current authenticated user role included grant access
 * @param {Array} roles array of the authorized roles for the current routes
 * @requires Auth middleware to be initiated first to work properly.
 */
module.exports = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) throw new ServerError('access denied.', 403);
      next();
    } catch (ex) {
      next(ex);
    }
  };
};
