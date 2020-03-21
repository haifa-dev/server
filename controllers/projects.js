const { Project, Link, Tag } = require('../db');
const ServerError = require('../utils/ServerError');

/**
 * get all the projects
 */
exports.getProjects = async (req, res) => {
  const projects = await Project.findAll(req.queryParams);

  res.send({
    status: 'Success',
    results: projects.length,
    data: projects
  });
};

/**
 * get project by id
 */
exports.getProject = async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  // validate if project exists
  if (!project) throw new ServerError('The project with the given ID was not found.', 404);

  res.send({
    status: 'Success',
    data: project
  });
};

/**
 * delete project by id
 */
exports.deleteProject = async (req, res) => {
  // find a single user with the id
  const project = await Project.findByPk(req.params.id);
  // validate dev profiles existence in the database
  if (!project) throw new ServerError('The project with the given ID was not found.', 404);

  await project.destroy();
  await Link.destroy({ where: { linkableId: req.params.id } });
  await Tag.destroy({ where: { taggedId: req.params.id } });

  // send status if successes
  res.status(204).json({
    status: 'Success',
    data: null
  });
};

/**
 * create new project with link tags via request body
 */
exports.createProject = async (req, res) => {
  // validate from project replicates
  const project = await Project.create(req.body, {
    include: { all: true }
  });
  res.status(201).send({
    status: 'Success',
    data: project
  });
};

/**
 * find project with primary key via param id and update via request body
 */
exports.updateProject = async (req, res) => {
  const project = await Project.findByPk(req.params.id, { include: { all: true } });
  // check if the profile exists
  if (!project) throw new ServerError('The project with the given ID was not found.', 404);

  // clear old data
  await Link.destroy({ where: { linkableId: req.params.id } });
  await Tag.destroy({ where: { taggedId: req.params.id } });

  // create links if any
  if (req.body.links) {
    req.body.links.forEach(link => {
      link.linkableId = req.params.id;
    });
    await Link.bulkCreate(req.body.links);
  }

  // create tags if any
  if (req.body.tags) {
    req.body.tags.forEach(tag => {
      tag.taggedId = req.params.id;
    });
    await Tag.bulkCreate(req.body.tags);
  }

  // save project changes
  await project.update(req.body);
  // refresh and get the updated version of the instance
  await project.reload({ include: { all: true } });

  res.send({
    status: 'Success',
    data: project
  });
};
