const Joi = require('@hapi/joi');
const AppError = require('../utils/AppError');

/**
 * req.params.id validation for UUID time
 */
module.exports = function isUUID(req, res, next) {
  const { error } = Joi.object({
    id: Joi.string()
      .uuid()
      .required()
  }).validate({ id: req.params.id });
  if (error) throw new AppError(error.details[0].message, 400);
  next();
};
