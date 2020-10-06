const router = require('express').Router();
const { projectReqs } = require('../controllers');
const { paramValidation, queryHandler, bodyValidation } = require('../middleware');
const { ProjectReq } = require('../db');

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
