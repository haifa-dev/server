const express = require('express');
const imgUpload = require('../middleware/imgUpload');
const { events: controller } = require('../controllers');

const router = express.Router();

router.get('/', controller.getEvents);

router.get('/:id', controller.getEventByPK);

router.delete('/:id', controller.deleteEventByPK);

router.use(imgUpload);

router.post('/', controller.createEvent);

router.put('/:id', controller.updateEvent);

module.exports = router;
