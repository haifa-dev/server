const _ = require('lodash');
const ProjectReq = require('../models/ProjectReq');
const AppError = require('../utils/AppError');

/**
 * get all the ProjectReq from the database
 * can pass pagination options offset, limit
 * via req.query
 */
exports.getProjectReqs = async (req, res) => {
  const { offset, limit } = req.query;
  let projectReq;

  // checking for pagination query options
  if (offset && limit) projectReq = await ProjectReq.findAndCountAll({ offset, limit, raw: true });
  else if (offset) projectReq = await ProjectReq.findAndCountAll({ offset, raw: true });
  else if (limit) projectReq = await ProjectReq.findAndCountAll({ limit, raw: true });
  else projectReq = await ProjectReq.findAndCountAll({ raw: true });

  res.send(projectReq);
};

/**
 * get a project request by the primary key via the req.params.id
 */
exports.getProjectReqByPK = async (req, res) => {
  // check if uuid isValid
  const { error } = ProjectReq.isUUID(req.params.id);
  if (error) throw new AppError(error.details[0].message, 400);

  const projectReq = await ProjectReq.findByPk(req.params.id, { raw: true });
  // validate dev profiles existence in the database
  if (!projectReq) {
    throw new AppError('The project request with the given ID was not found.', 404);
  }
  res.send(projectReq);
};

/**
 * remove a project request if exists
 */
exports.deleteProjectReqByPK = async (req, res) => {
  // check if uuid isValid
  const { error } = ProjectReq.isUUID(req.params.id);
  if (error) throw new AppError(error.details[0].message, 400);
  // find a single user with the id
  const projectReq = await ProjectReq.findByPk(req.params.id);
  // validate dev profiles existence in the database
  if (!projectReq) {
    throw new AppError('The project request with the given ID was not found.', 404);
  }
  // delete the current project request
  await projectReq.destroy();
  // send status if successes
  res.sendStatus(204);
};

/**
 * Create new project request if valid
 */
exports.createProjectReq = async (req, res) => {
  //  user input validation
  const { error } = await ProjectReq.validateAll(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  // validate from project request replicates
  let projectReq = await ProjectReq.findOne({
    where: { email: req.body.email }
  });
  if (projectReq) {
    throw new AppError('The project request already exists.', 400);
  }
  projectReq = await ProjectReq.create(
    _.pick(req.body, ['date', 'email', 'content', 'submittedBy', 'phone'])
  );
  res.status(201).send(projectReq);
};

exports.updateProjectReq = async (req, res) => {
  // check if uuid isValid
  const { error: uuidError } = ProjectReq.isUUID(req.params.id);
  if (uuidError) {
    throw new AppError(uuidError.details[0].message, 400);
  }
  //  user input validation
  const { error } = await ProjectReq.validateAll(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  const projectReq = await ProjectReq.findByPk(req.params.id);
  // check if the request exists
  if (!projectReq) {
    throw new AppError('The project request with the given ID was not found.', 404);
  }
  // remove the old image
  await projectReq.update(_.pick(req.body, ['date', 'email', 'content', 'submittedBy', 'phone']));

  res.send(projectReq);
};
