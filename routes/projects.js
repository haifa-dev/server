const express = require('express');
const { projects: controller } = require('../controllers');
const isUUID = require('../middleware/isUUID');

const router = express.Router();

router.get('/', controller.getProjects);

router.get('/:id', isUUID, controller.getProject);

router.delete('/:id', isUUID, controller.deleteProject);

router.post('/', controller.validateProject, controller.createProject);

router.put('/:id', isUUID, controller.validateProject, controller.updateProject);

module.exports = router;
