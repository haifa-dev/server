const router = require('express').Router();
const { projects } = require('../controllers');
const paramValidation = require('../middleware/paramValidation');
const imageHandler = require('../middleware/imageHandler');
const queryHandler = require('../middleware/queryHandler');
const bodyValidation = require('../middleware/bodyValidation');
const { Project } = require('../db');

const { getProjects, createProject, getProject, deleteProject, updateProject } = projects;

router
  .route('/')
  .get(queryHandler(Project), getProjects)
  .post(imageHandler, bodyValidation(Project), createProject);

router
  .route('/:id')
  .get(paramValidation, getProject)
  .delete(paramValidation, deleteProject)
  .put(paramValidation, imageHandler, bodyValidation(Project), updateProject);

module.exports = router;
