const AppError = require('../utils/AppError');

/**
 * get Model that returns a middleware which get request body parameters for validation and Input sanitization.
 * @param Model sequelize Model Object
 */
module.exports = Model => {
  return (req, res, next) => {
    try {
      const { error } = Model.intensifiedValidation(req.body);
      if (error) throw new AppError(error.details[0].message, 400);

      next();
    } catch (error) {
      next(error);
    }
  };
};
