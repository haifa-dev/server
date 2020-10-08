const { generateCharitableProjectRequests } = require('../../utils/generateData');
const { objFromCamelCaseToSnakeCase } = require('../../utils/objectModification');

module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert(
      'charitable_project_reqs',
      generateCharitableProjectRequests().map(charitableProjectRequest =>
        objFromCamelCaseToSnakeCase(charitableProjectRequest)
      ),
      {}
    ),
  down: queryInterface => queryInterface.bulkDelete('charitable_project_reqs', null, {})
};
