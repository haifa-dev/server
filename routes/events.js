const router = require('express').Router();
const imgUpload = require('../middleware/imgUpload');
const { events } = require('../controllers');
const isUUID = require('../middleware/isUUID');

const { getEvents, getEvent, deleteEvent, validateEvent, createEvent, updateEvent } = events;

router
  .route('/')
  .get(getEvents)
  .post(imgUpload, validateEvent, createEvent);

router
  .route('/:id')
  .get(isUUID, getEvent)
  .delete(isUUID, deleteEvent)
  .put(isUUID, imgUpload, validateEvent, updateEvent);

module.exports = router;
