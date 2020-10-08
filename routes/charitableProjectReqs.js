const router = require('express').Router();
const bodyValidation = require('../middleware/bodyValidation');
const CharitableProjectReq = require('../models/CharitableProjectReq');
const queryHandler = require('../middleware/queryHandler');
const { charitableProjectReqs } = require('../controllers');
const paramValidation = require('../middleware/paramValidation');

const {
  getCharitableProjectRequests,
  getCharitableProjectRequest,
  deleteCharitableProjectRequest,
  createCharitableProjectRequest,
  updateCharitableProjectRequest
} = charitableProjectReqs;

router
  .route('/')
  .get(queryHandler(CharitableProjectReq), getCharitableProjectRequests)
  .post(bodyValidation(CharitableProjectReq, 'create'), createCharitableProjectRequest);

router
  .route('/:id')
  .get(paramValidation('id'), getCharitableProjectRequest)
  .put(
    paramValidation('id'),
    bodyValidation(CharitableProjectReq, 'create'),
    updateCharitableProjectRequest
  )
  .delete(paramValidation('id'), deleteCharitableProjectRequest);

module.exports = router;
