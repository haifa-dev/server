const express = require('express');
const imgUpload = require('../middleware/imgUpload');
const { events: controller } = require('../controllers');
const isUUID = require('../middleware/isUUID');

const router = express.Router();

router.get('/', controller.getEvents);

router.get('/:id', isUUID, controller.getEvent);

router.delete('/:id', isUUID, controller.deleteEvent);

router.post('/', imgUpload, controller.validateEvent, controller.createEvent);

router.put('/:id', isUUID, imgUpload, controller.validateEvent, controller.updateEvent);

module.exports = router;
