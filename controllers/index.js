const devProfiles = require('./devProfiles');
const events = require('./events');
const projectReqs = require('./projectReqs');
const projects = require('./projects');

const controllers = { devProfiles, events, projectReqs, projects };

/**
 * wrap express async routes with tryCatch blocks
 * @param {*} handler express route
 */
function asyncErrorHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (ex) {
      next(ex);
    }
  };
}

/**
 *  wrap controllers entries with tryCatch.
 * @param {*} controller
 */
function injectAsyncErrorWrapper(controller) {
  Object.keys(controller).forEach(key => {
    controller[key] = asyncErrorHandler(controller[key]);
  });
}

Object.values(controllers).forEach(controller => injectAsyncErrorWrapper(controller));

module.exports = controllers;
