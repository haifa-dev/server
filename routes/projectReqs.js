const router = require('express').Router();
const { projectReqs } = require('../controllers');
const isUUID = require('../middleware/isUUID');

const {
  getProjectReqs,
  getProjectReq,
  deleteProjectReq,
  validateProjectReq,
  createProjectReq,
  updateProjectReq
} = projectReqs;

router
  .route('/')
  .get(getProjectReqs)
  .post(validateProjectReq, createProjectReq);

router
  .route('/:id')
  .get(isUUID, getProjectReq)
  .delete(isUUID, deleteProjectReq)
  .put(isUUID, validateProjectReq, updateProjectReq);

module.exports = router;
