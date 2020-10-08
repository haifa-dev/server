const { cyan, green, red } = require('chalk');

const { log, error } = console;

module.exports = {
  success: s => log(green(s)),
  failure: s => error(red(s)),
  query: q => log(cyan(`\n${q}\n`))
};
