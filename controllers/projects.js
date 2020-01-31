const _ = require('lodash');
const Project = require('../models/Project');
const AppError = require('../utils/AppError');

/**
 * get all the Project from the database
 * can pass pagination options offset, limit
 * via req.query
 */
exports.getProjects = async (req, res) => {
  const { offset, limit } = req.query;
  let project;

  // checking for pagination query options
  if (offset && limit) project = await Project.findAndCountAll({ offset, limit, raw: true });
  else if (offset) project = await Project.findAndCountAll({ offset, raw: true });
  else if (limit) project = await Project.findAndCountAll({ limit, raw: true });
  else project = await Project.findAndCountAll({ raw: true });

  res.send(project);
};

/**
 * get a project request by the primary key via the req.params.id
 */
exports.getProjectByPK = async (req, res) => {
  const project = await Project.findByPk(req.params.id, { raw: true });
  // validate dev profiles existence in the database
  if (!project) {
    throw new AppError('The project request with the given ID was not found.', 404);
  }
  res.send(project);
};

/**
 * remove a project request if exists
 */
exports.deleteProjectByPK = async (req, res) => {
  // find a single user with the id
  const project = await Project.findByPk(req.params.id);
  // validate dev profiles existence in the database
  if (!project) {
    throw new AppError('The project request with the given ID was not found.', 404);
  }
  // delete the current project request
  await project.destroy();
  // send status if successes
  res.sendStatus(204);
};

/**
 * Create new project request if valid
 */
exports.createProject = async (req, res) => {
  //  user input validation
  const { error } = await Project.validateAll(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const project = await Project.create(_.pick(req.body, ['title', 'description']));
  res.status(201).send(project);
};

exports.updateProject = async (req, res) => {
  //  user input validation
  const { error } = await Project.validateAll(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  const project = await Project.findByPk(req.params.id);
  // check if the request exists
  if (!project) {
    throw new AppError('The project request with the given ID was not found.', 404);
  }
  // remove the old image
  await project.update(_.pick(req.body, ['title', 'description']));

  res.send(project);
};
