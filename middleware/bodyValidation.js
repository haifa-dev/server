const ServerError = require('../utils/ServerError');

// a batter solution need to implement for all the routes before deleting the old version require module adjustment
exports.bodyValidation = (Model, validationType) => {
  return (req, res, next) => {
    try {
      const { error } = Model.validate(req.body, validationType);
      if (error) throw new ServerError(error.details[0].message, 400);

      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Creates a validation middleware that validates request body
 * For given Model based on it's validation methods
 *
 * @param {import('sequelize').Model} Model sequelize Model Object
 */
module.exports = (Model, strengthened = true) => {
  return (req, res, next) => {
    try {
      delete req.body.updatedAt;
      delete req.body.createdAt;

      const { error } = strengthened
        ? Model.intensifiedValidation(req.body)
        : Model.validate(req.body);
      if (error) {
        throw new ServerError(error.details[0].message, 400);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
