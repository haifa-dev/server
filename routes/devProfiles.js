const express = require('express');
const imgUpload = require('../middleware/imgUpload');
const { devProfiles: controller } = require('../controllers');

const router = express.Router();

router.get('/', controller.getDevProfiles);

router.get('/:id', controller.getDevProfileByPK);

router.delete('/:id', controller.deleteDevProfileByPK);

router.use(imgUpload);

router.post('/', controller.createDevProfile);

router.put('/:id', controller.updateDevProfile);

module.exports = router;
