const { NODE_ENV } = process.env;

module.exports = {
  isTest: NODE_ENV === 'test',
  isProd: NODE_ENV === 'production',
  isDev: !NODE_ENV || NODE_ENV === 'development'
};
