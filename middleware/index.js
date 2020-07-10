const auth = require('./auth');
const bodyValidation = require('./bodyValidationOld');
const errorHandler = require('./errorHandler');
const imageHandler = require('./imageHandler');
const paramValidation = require('./paramValidation');
const queryHandler = require('./queryHandler');
const roleRestriction = require('./roleRestriction');

module.exports = {
  auth,
  bodyValidation,
  errorHandler,
  imageHandler,
  paramValidation,
  queryHandler,
  roleRestriction
};
