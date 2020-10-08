const ServerError = require('../utils/ServerError');
const CharitableProjectReq = require('../models/CharitableProjectReq');

/**
 * get all the charitable project requests.
 */
exports.getCharitableProjectRequests = async (req, res) => {
  const charitableProjectRequests = await CharitableProjectReq.findAll(req.queryParams);

  res.send({
    status: 'success',
    results: charitableProjectRequests.length,
    charitableProjectRequests
  });
};

/**
 * get charitable project request by id
 */
exports.getCharitableProjectRequest = async (req, res) => {
  const charitableProjectRequest = await CharitableProjectReq.findByPk(req.params.id);
  // validate if the project request exists
  if (!charitableProjectRequest) {
    throw new ServerError('The charitable project request with the given ID was not found.', 404);
  }
  res.status(200).json({
    status: 'success',
    charitableProjectRequest
  });
};

/**
 * delete charitable project request by id
 */
exports.deleteCharitableProjectRequest = async (req, res) => {
  // find a single charitable project request with the id
  const charitableProjectRequest = await CharitableProjectReq.findByPk(req.params.id);

  // validate charitable project request existence in the database
  if (!charitableProjectRequest)
    throw new ServerError('The charitable project request with the given ID was not found.', 404);

  await charitableProjectRequest.destroy();
  // send status if successes
  res.status(204).send({
    status: 'success',
    charitableProjectRequest: null
  });
};

/**
 * create new charitable project request via request body
 */
exports.createCharitableProjectRequest = async (req, res) => {
  const charitableProjectRequest = await CharitableProjectReq.create(req.body);
  res.status(201).send({
    status: 'success',
    charitableProjectRequest
  });
};

/**
 * update existing project request by id
 */
exports.updateCharitableProjectRequest = async (req, res) => {
  const charitableProjectRequest = await CharitableProjectReq.findByPk(req.params.id);
  // check if the charitable project request exists
  if (!charitableProjectRequest) {
    throw new ServerError('The charitable project request with the given ID was not found.', 404);
  }
  await charitableProjectRequest.update(req.body);

  res.send({
    status: 'success',
    charitableProjectRequest
  });
};
