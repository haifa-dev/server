const router = require('express').Router();
const bodyValidation = require('../middleware/bodyValidation');
const ProfitableProjectReq = require('../models/ProfitableProjectReq');
const queryHandler = require('../middleware/queryHandler');
const { profitableProjectReqs } = require('../controllers');
const paramValidation = require('../middleware/paramValidation');

const {
  getProfitableProjectRequests,
  getProfitableProjectRequest,
  deleteProfitableProjectRequest,
  createProfitableProjectRequest,
  updateProfitableProjectRequest
} = profitableProjectReqs;

router
  .route('/')
  .get(queryHandler(ProfitableProjectReq), getProfitableProjectRequests)
  .post(bodyValidation(ProfitableProjectReq, 'create'), createProfitableProjectRequest);

router
  .route('/:id')
  .get(paramValidation('id'), getProfitableProjectRequest)
  .put(
    paramValidation('id'),
    bodyValidation(ProfitableProjectReq, 'create'),
    updateProfitableProjectRequest
  )
  .delete(paramValidation('id'), deleteProfitableProjectRequest);

module.exports = router;
