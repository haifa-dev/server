const { removeImg } = require('../utils/fsManipulations');

const { error } = console;

/**
 * meant for production environment case, return and log error details
 * base on the error Operational status.
 * @param {*} err express error object
 * @param {*} res express response object
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted errors
  if (err.isPlaned) res.status(err.statusCode).send({ status: err.status, message: err.message });
  else {
    // Programing or other unknown errors: don't leek error details
    error(err);
    res.status(500).send({ status: 'error', message: 'Internal server error.' });
  }
};
/**
 * meant for development environment case, return and log error details
 * base on the error Operational status.
 * @param {*} err express error object
 * @param {*} res express response object
 */
const sendErrorDev = (err, res) => {
  // log Programing or other unknown errors
  if (!err.isPlaned) error(err);
  res.status(err.statusCode).send({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack.split('\n').map(line => line.trim())
  });
};

/**
 * Handle express errors base on origin, environment and status code.
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // clean file if the request failed
  if (req.file) {
    removeImg(req.file.path);
  }

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === undefined ||
    process.env.NODE_ENV === 'test'
  )
    sendErrorDev(err, res);
  else if (process.env.NODE_ENV === 'production') sendErrorProd(err, res);
};
