const router = require('express').Router();
const imgUpload = require('../middleware/imgUpload');
const { devProfiles } = require('../controllers');
const isUUID = require('../middleware/isUUID');

const {
  getDevProfiles,
  validateDevProfile,
  createDevProfile,
  getDevProfile,
  deleteDevProfile,
  updateDevProfile
} = devProfiles;

router
  .route('/')
  .get(getDevProfiles)
  .post(imgUpload, validateDevProfile, createDevProfile);

router
  .route('/:id')
  .get(isUUID, getDevProfile)
  .delete(isUUID, deleteDevProfile)
  .put(isUUID, imgUpload, validateDevProfile, updateDevProfile);

module.exports = router;
