const ServerError = require('../utils/ServerError');

/**
 * create a validation middleware that validates request body for given model base on it's validation type
 * @param {import('sequelize').Model} Model sequelize Model Object
 */

module.exports = (Model, validationType) => {
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
