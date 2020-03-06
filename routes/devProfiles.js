const router = require('express').Router();
const imgUpload = require('../middleware/imgUpload');
const { devProfiles } = require('../controllers');
const DevProfile = require('../models/DevProfile');
const paramValidation = require('../middleware/paramValidation');
const queryHandler = require('../middleware/queryHandler');
const bodyValidation = require('../middleware/bodyValidation');

const {
  getDevProfiles,
  createDevProfile,
  getDevProfile,
  deleteDevProfile,
  updateDevProfile
} = devProfiles;

router.get('/test', async (req, res) => {
  const { body, query, params } = req;
  res.send({ body, query, params });
});

router
  .route('/')
  .get(queryHandler(DevProfile), getDevProfiles)
  .post(imgUpload, bodyValidation(DevProfile), createDevProfile);

router
  .route('/:id')
  .get(paramValidation, getDevProfile)
  .delete(paramValidation, deleteDevProfile)
  .put(paramValidation, imgUpload, bodyValidation(DevProfile), updateDevProfile);

module.exports = router;
