const Joi = require('@hapi/joi');
const ServerError = require('../utils/ServerError');

/**
 * get request's param for validation and Input sanitization.
 */
module.exports = (req, res, next) => {
  const { error } = Joi.object({
    id: Joi.string()
      .uuid()
      .required()
  }).validate({ id: req.params.id });
  if (error) throw next(new ServerError(error.details[0].message, 404));
  return next();
};
