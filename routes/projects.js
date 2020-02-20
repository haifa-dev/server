const express = require('express');
const { projects: controller } = require('../controllers');
const isUUID = require('../middleware/isUUID');
const imgUpload = require('../middleware/imgUpload');

const router = express.Router();

router.get('/', controller.getProjects);

router.get('/:id', isUUID, controller.getProject);

router.delete('/:id', isUUID, controller.deleteProject);

router.post('/', imgUpload, controller.validateProject, controller.createProject);

router.put('/:id', isUUID, imgUpload, controller.validateProject, controller.updateProject);

module.exports = router;
