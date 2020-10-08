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
  createCharitableProjectReq,
  updateCharitableProjectReq
} = charitableProjectReqs;

router
  .route('/')
  .get(queryHandler(CharitableProjectReq), getCharitableProjectRequests)
  .post(bodyValidation(CharitableProjectReq, 'create'), createCharitableProjectReq);

router
  .route('/:id')
  .get(paramValidation('id'), getCharitableProjectRequest)
  .put(paramValidation('id'), updateCharitableProjectReq)
  .delete(paramValidation('id'), deleteCharitableProjectRequest);

module.exports = router;
