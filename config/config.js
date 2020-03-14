const { NODE_ENV } = process.env;

module.exports = {
  isProd: NODE_ENV === 'production',
  isDev: !NODE_ENV || NODE_ENV === 'development'
};
