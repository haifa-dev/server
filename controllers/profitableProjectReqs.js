const ServerError = require('../utils/ServerError');
const ProfitableProjectReq = require('../models/ProfitableProjectReq');

/**
 * get all the profitable project requests.
 */
exports.getProfitableProjectRequests = async (req, res) => {
  const profitableProjectRequests = await ProfitableProjectReq.findAll(req.queryParams);

  res.send({
    status: 'success',
    results: profitableProjectRequests.length,
    profitableProjectRequests
  });
};

/**
 * get profitable project request by id
 */
exports.getProfitableProjectRequest = async (req, res) => {
  const profitableProjectRequest = await ProfitableProjectReq.findByPk(req.params.id);
  // validate if the project request exists
  if (!profitableProjectRequest) {
    throw new ServerError('The profitable project request with the given ID was not found.', 404);
  }
  res.status(200).json({
    status: 'success',
    profitableProjectRequest
  });
};

/**
 * delete profitable project request by id
 */
exports.deleteProfitableProjectRequest = async (req, res) => {
  // find a single profitable project request with the id
  const profitableProjectRequest = await ProfitableProjectReq.findByPk(req.params.id);

  // validate profitable project request existence in the database
  if (!profitableProjectRequest)
    throw new ServerError('The profitable project request with the given ID was not found.', 404);

  await profitableProjectRequest.destroy();
  // send status if successes
  res.status(204).send({
    status: 'success',
    profitableProjectRequest: null
  });
};

/**
 * create new profitable project request via request body
 */
exports.createProfitableProjectRequest = async (req, res) => {
  const profitableProjectRequest = await ProfitableProjectReq.create(req.body);
  res.status(201).send({
    status: 'success',
    profitableProjectRequest
  });
};

/**
 * update existing project request by id
 */
exports.updateProfitableProjectRequest = async (req, res) => {
  const profitableProjectRequest = await ProfitableProjectReq.findByPk(req.params.id);
  // check if the profitable project request exists
  if (!profitableProjectRequest) {
    throw new ServerError('The profitable project request with the given ID was not found.', 404);
  }
  await profitableProjectRequest.update(req.body);

  res.send({
    status: 'success',
    profitableProjectRequest
  });
};
