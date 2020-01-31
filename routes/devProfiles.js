const express = require('express');
const imgUpload = require('../middleware/imgUpload');
const { devProfiles: controller } = require('../controllers');
const isUUID = require('../middleware/isUUID');

const router = express.Router();

router.get('/', controller.getDevProfiles);

router.get('/:id', isUUID, controller.getDevProfile);

router.delete('/:id', isUUID, controller.deleteDevProfile);

router.post('/', imgUpload, controller.validateDevProfile, controller.createDevProfile);

router.put('/:id', isUUID, imgUpload, controller.validateDevProfile, controller.updateDevProfile);

module.exports = router;
