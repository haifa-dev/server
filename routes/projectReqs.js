const router = require('express').Router();
const { projectReqs } = require('../controllers');
const paramValidation = require('../middleware/paramValidation');
const queryHandler = require('../middleware/queryHandler');
const bodyValidation = require('../middleware/bodyValidation');
const ProjectReq = require('../models/ProjectReq');

const {
  getProjectReqs,
  getProjectReq,
  deleteProjectReq,
  createProjectReq,
  updateProjectReq
} = projectReqs;

router
  .route('/')
  .get(queryHandler(ProjectReq), getProjectReqs)
  .post(bodyValidation(ProjectReq), createProjectReq);

router
  .route('/:id')
  .get(paramValidation, getProjectReq)
  .delete(paramValidation, deleteProjectReq)
  .put(paramValidation, bodyValidation(ProjectReq), updateProjectReq);

module.exports = router;
