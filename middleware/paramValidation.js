const Joi = require('@hapi/joi');
const ServerError = require('../utils/ServerError');

/**
 * get request's param for validation and Input sanitization.
 */
module.exports = (...ids) => {
  const PARAM_SCHEMA = Joi.object(
    ids.reduce((idArray, id) => ({ ...idArray, [id]: Joi.string().uuid().required() }), {})
  );

  return (req, res, next) => {
    const { error } = PARAM_SCHEMA.validate({ [ids]: req.params[ids] });
    if (error) throw next(new ServerError(error.details[0].message, 404));
    return next();
  };
};
