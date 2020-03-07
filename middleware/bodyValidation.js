const ServerError = require('../utils/ServerError');

/**
 * get Model that returns a middleware which get request body parameters for validation and Input sanitization.
 * @param Model sequelize Model Object
 */
module.exports = (Model, strengthened = true) => {
  return (req, res, next) => {
    try {
      const { error } = strengthened
        ? Model.intensifiedValidation(req.body)
        : Model.validate(req.body);
      if (error) throw new ServerError(error.details[0].message, 400);

      next();
    } catch (error) {
      next(error);
    }
  };
};
