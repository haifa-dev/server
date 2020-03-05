const fs = require('fs');
const path = require('path');

const controllers = {};

const files = fs.readdirSync(__dirname);

const requireController = file => {
  if (/.js$/.test(file) && file !== 'index.js') {
    file = file.split('.')[0];
    controllers[file] = require(path.join(__dirname, file)); // eslint-disable-line
  }
};

files.forEach(requireController);

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
