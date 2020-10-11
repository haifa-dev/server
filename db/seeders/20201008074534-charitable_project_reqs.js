const { generateArr, generateCharitableProjectRequest } = require('../../utils/generateData');
const { objFromCamelCaseToSnakeCase } = require('../../utils/objectModification');

const MIN_CHARITABLE_REQUESTS_CREATED = 20;
const MAX_CHARITABLE_REQUEST_CREATED = 21;

module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert(
      'charitable_project_reqs',
      generateArr(
        generateCharitableProjectRequest,
        MAX_CHARITABLE_REQUEST_CREATED,
        MIN_CHARITABLE_REQUESTS_CREATED
      ).map(charitableProjectRequest => objFromCamelCaseToSnakeCase(charitableProjectRequest)),
      {}
    ),
  down: queryInterface => queryInterface.bulkDelete('charitable_project_reqs', null, {})
};
