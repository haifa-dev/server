const express = require('express');
const { projectReqs: controller } = require('../controllers');
const isUUID = require('../middleware/isUUID');

const router = express.Router();

router.get('/', controller.getProjectReqs);

router.get('/:id', isUUID, controller.getProjectReq);

router.delete('/:id', isUUID, controller.deleteProjectReq);

router.post('/', controller.validateProjectReq, controller.createProjectReq);

router.put('/:id', isUUID, controller.validateProjectReq, controller.updateProjectReq);

module.exports = router;
