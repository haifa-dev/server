const router = require('express').Router();
const { projects } = require('../controllers');
const isUUID = require('../middleware/isUUID');
const imgUpload = require('../middleware/imgUpload');

const {
  getProjects,
  validateProject,
  createProject,
  getProject,
  deleteProject,
  updateProject
} = projects;

router
  .route('/')
  .get(getProjects)
  .post(imgUpload, validateProject, createProject);

router
  .route('/:id')
  .get(isUUID, getProject)
  .delete(isUUID, deleteProject)
  .put(isUUID, imgUpload, validateProject, updateProject);

module.exports = router;
