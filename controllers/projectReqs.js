const { ProjectReq } = require('../db');
const ServerError = require('../utils/ServerError');

/**
 * get all the project requests
 */
exports.getProjectReqs = async (req, res) => {
  const projectReqs = await ProjectReq.findAll({
    subQuery: true,
    ...req.queryParams,
    include: { all: true }
  });

  res.send({
    status: 'Success',
    results: projectReqs.length,
    data: projectReqs
  });
};

/**
 * get project request by id
 */
exports.getProjectReq = async (req, res) => {
  const projectReq = await ProjectReq.findByPk(req.params.id, { raw: true });
  // validate if developer profile exists
  if (!projectReq)
    throw new ServerError('The developer profile with the given ID was not found.', 404);

  res.status(200).send({
    status: 'Success',
    data: projectReq
  });
};

/**
 * delete project request by id
 */
exports.deleteProjectReq = async (req, res) => {
  // find a single user with the id
  const projectReq = await ProjectReq.findByPk(req.params.id);
  // validate dev profiles existence in the database
  if (!projectReq)
    throw new ServerError('The developer profile with the given ID was not found.', 404);

  // delete the current developer profile
  await projectReq.destroy();
  // send status if successes
  res.status(204).send({
    status: 'Success',
    data: null
  });
};

/**
 * create new project request
 */
exports.createProjectReq = async (req, res) => {
  const projectReq = await ProjectReq.create(req.body);

  res.status(201).send({
    status: 'Success',
    data: projectReq
  });
};

/**
 * update existing project request by id
 */
exports.updateProjectReq = async (req, res) => {
  const projectReq = await ProjectReq.findByPk(req.params.id);
  // check if the request exists
  if (!projectReq) {
    throw new ServerError('The project request with the given ID was not found.', 404);
  }
  // remove the old image
  await projectReq.update(req.body);

  res.send({
    status: 'Success',
    data: projectReq
  });
};
