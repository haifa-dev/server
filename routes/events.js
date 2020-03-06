const router = require('express').Router();
const imgUpload = require('../middleware/imgUpload');
const { events } = require('../controllers');
const paramValidation = require('../middleware/paramValidation');
const queryHandler = require('../middleware/queryHandler');
const bodyValidation = require('../middleware/bodyValidation');
const Event = require('../models/Event');

const { getEvents, getEvent, deleteEvent, createEvent, updateEvent } = events;

router
  .route('/')
  .get(queryHandler(Event), getEvents)
  .post(imgUpload, bodyValidation(Event), createEvent);

router
  .route('/:id')
  .get(paramValidation, getEvent)
  .delete(paramValidation, deleteEvent)
  .put(paramValidation, imgUpload, bodyValidation(Event), updateEvent);

module.exports = router;
