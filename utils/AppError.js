module.exports =
  /**
   * extended error object for express route purposes
   * @param message the error message
   * @param statusCode the error status code
   */
  class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'Failure' : 'Error';
      this.isPlaned = true;

      // Prevent the error stack trace from being polluted
      Error.captureStackTrace(this, this.constructor);
    }
  };
