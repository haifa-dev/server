const Project = require('../models/Project');
const AppError = require('../utils/AppError');
const { removeImg } = require('../utils/fileSystem');
const Link = require('../models/Link');
const Tag = require('../models/Tag');

/**
 * get all the projects can pass
 * pagination options offset and limit via query.
 */
exports.getProjects = async (req, res) => {
  const { offset, limit } = req.query;
  const projectParams = { subQuery: true, include: { all: true } };

  // checking for pagination query options
  if (offset) projectParams.offset = offset;
  if (limit) projectParams.limit = limit;

  const projects = await Project.findAll(projectParams);

  res.send(projects);
};

/**
 * get project by passing the primary key via the param id.
 */
exports.getProject = async (req, res) => {
  const project = await Project.findByPk(req.params.id, {
    include: { all: true }
  });
  // validate if project exists
  if (!project) throw new AppError('The project with the given ID was not found.', 404);

  res.send(project);
};

/**
 * delete project by passing the primary key via the param id.
 */
exports.deleteProject = async (req, res) => {
  // find a single user with the id
  const project = await Project.findByPk(req.params.id);
  // validate dev profiles existence in the database
  if (!project) throw new AppError('The project with the given ID was not found.', 404);

  // delete the current project
  await removeImg(project.image);
  await project.destroy();
  
  // send status if successes
  res.sendStatus(204);
};

/**
 * middleware validation with project schema for req.body
 */
exports.validateProject = (req, res, next) => {
  //  user input validation
  const { error } = Project.validateAll(req.body);
  if (error) throw new AppError(error.details[0].message, 400);
  next();
};

/**
 * create new project with link tags via request body
 */
exports.createProject = async (req, res) => {
  // validate from project replicates
  const project = await Project.create(req.body, {
    include: { all: true }
  });
  res.status(201).send(project);
};

/**
 * find project with primary key via param id and update via request body
 */
exports.updateProject = async (req, res) => {
  const project = await Project.findByPk(req.params.id, { include: { all: true } });
  // check if the profile exists
  if (!project) throw new AppError('The project with the given ID was not found.', 404);
  // remove old image
  await removeImg(project.image);
  // clear old data
  await Link.destroy({ where: { projectId: req.params.id } });
  await Tag.destroy({ where: { ProjectId: req.params.id } });

  // create links if any
  if (req.body.links) {
    req.body.links.forEach(link => {
      link.projectId = req.params.id;
    });
    await Link.bulkCreate(req.body.links);
  }

  // create tags if any
  if (req.body.tags) {
    req.body.tags.forEach(tag => {
      tag.ProjectId = req.params.id;
    });
    await Tag.bulkCreate(req.body.tags);
  }

  // save project changes
  await project.update(req.body);
  // refresh and get the updated version of the instance
  await project.reload({ include: { all: true } });

  res.send(project);
};
