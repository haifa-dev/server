const ServerError = require('../utils/ServerError');

/**
 * Creates a validation middleware that validates request body
 * For given Model based on it's validation methods
 *
 * @param {import('sequelize').Model} Model sequelize Model Object
 */
module.exports = (Model, strengthened = true) => {
  return (req, res, next) => {
    try {
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
