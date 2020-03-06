const Joi = require('@hapi/joi');
const AppError = require('../utils/AppError');

/**
 * get Model and return middleware that handle request's query parameters for pagination and sorting data.
 * @param Model sequelize Model Object
 */
module.exports = Model => {
  return (req, res, next) => {
    try {
      // input sanitization and validation
      const { error } = Joi.object({
        page: Joi.number().integer(),
        limit: Joi.number()
          .integer()
          .max(100),
        order: Joi.array()
          .min(1)
          .max(2)
          .items(
            Joi.object({
              direction: Joi.string()
                .valid('ASC', 'DESC')
                .required(),
              col: Joi.string()
                .valid(...Object.keys(Model.rawAttributes))
                .required()
            })
          )
      }).validate(req.query);
      if (error) throw new AppError(error.details[0].message, 400);

      // handle pagination or set default values
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 50;
      const offset = (page - 1) * limit;

      // adjust order parameters or set default values
      const order = req.query.order
        ? req.query.order.map(field => [field.col, field.direction])
        : [['updatedAt', 'DESC']];

      // insert queryParams into the request object for further use
      req.queryParams = { offset, limit, order };
      next();
    } catch (error) {
      next(error);
    }
  };
};
