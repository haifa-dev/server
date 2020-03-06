const router = require('express').Router();
const { projects } = require('../controllers');
const paramValidation = require('../middleware/paramValidation');
const imgUpload = require('../middleware/imgUpload');
const queryHandler = require('../middleware/queryHandler');
const bodyValidation = require('../middleware/bodyValidation');
const Project = require('../models/Project');

const { getProjects, createProject, getProject, deleteProject, updateProject } = projects;

router
  .route('/')
  .get(queryHandler(Project), getProjects)
  .post(imgUpload, bodyValidation(Project), createProject);

router
  .route('/:id')
  .get(paramValidation, getProject)
  .delete(paramValidation, deleteProject)
  .put(paramValidation, imgUpload, bodyValidation(Project), updateProject);

module.exports = router;
