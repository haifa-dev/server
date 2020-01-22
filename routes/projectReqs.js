const express = require('express');
const { projectReqs: controller } = require('../controllers');

const router = express.Router();

router.get('/', controller.getProjectReqs);

router.get('/:id', controller.getProjectReqByPK);

router.delete('/:id', controller.deleteProjectReqByPK);

router.post('/', controller.createProjectReq);

router.put('/:id', controller.updateProjectReq);

module.exports = router;
