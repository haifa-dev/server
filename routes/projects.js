const express = require('express');
const { projects: controller } = require('../controllers');

const router = express.Router();

router.get('/', controller.getProjects);

router.get('/:id', controller.getProjectByPK);

router.delete('/:id', controller.deleteProjectByPK);

router.post('/', controller.createProject);

router.put('/:id', controller.updateProject);

module.exports = router;
