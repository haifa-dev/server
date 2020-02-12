const _ = require('lodash');
const ProjectReq = require('../models/ProjectReq');
const AppError = require('../utils/AppError');
/**
 * get all the project requests can pass
 * pagination options offset and limit via query.
 */
exports.getProjectReqs = async (req, res) => {
  const { offset, limit } = req.query;
  const projectReqsParams = { subQuery: true, include: { all: true } };

  // checking for pagination query options
  if (offset) projectReqsParams.offset = offset;
  if (limit) projectReqsParams.limit = limit;

  const projectReq = await ProjectReq.findAll(projectReqsParams);

  res.send(projectReq);
};

/**
 * get project request by passing the primary key via the param id.
 */
exports.getProjectReq = async (req, res) => {
  const projectReq = await ProjectReq.findByPk(req.params.id, {
    include: 'socials',
    raw: true,
    nest: true
  });
  // validate if developer profile exists
  if (!projectReq) {
    throw new AppError('The developer profile with the given ID was not found.', 404);
  }
  res.send(projectReq);
};

/**
 * delete project request by passing the primary key via the param id.
 */
exports.deleteProjectReq = async (req, res) => {
  // find a single user with the id
  const projectReq = await ProjectReq.findByPk(req.params.id);
  // validate dev profiles existence in the database
  if (!projectReq)
    throw new AppError('The developer profile with the given ID was not found.', 404);

  // delete the current developer profile
  await projectReq.destroy();
  // send status if successes
  res.sendStatus(204);
};

/**
 * middleware validation with ProjectReq schema for req.body
 */
exports.validateProjectReq = (req, res, next) => {
  //  user input validation
  const { error } = ProjectReq.validateAll(req.body);
  if (error) throw new AppError(error.details[0].message, 400);
  next();
};

/**
 * create new project req with social tags via request body
 */
exports.createProjectReq = async (req, res) => {
  const projectReq = await ProjectReq.create(req.body, {
    include: { all: true }
  });
  res.status(201).send(projectReq);
};

exports.updateProjectReq = async (req, res) => {
  const projectReq = await ProjectReq.findByPk(req.params.id);
  // check if the request exists
  if (!projectReq) {
    throw new AppError('The project request with the given ID was not found.', 404);
  }
  // remove the old image
  await projectReq.update(_.pick(req.body, ['date', 'email', 'content', 'submittedBy', 'phone']));

  res.send(projectReq);
};
