const { snakeCase } = require('lodash');

exports.objFromCamelCaseToSnakeCase = obj => {
  const camelCaseObj = {};

  Object.keys(obj).forEach(key => {
    camelCaseObj[snakeCase(key)] = obj[key];
  });

  return camelCaseObj;
};
