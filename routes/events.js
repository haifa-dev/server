const router = require('express').Router();
const imageHandler = require('../middleware/imageHandler');
const { events } = require('../controllers');
const paramValidation = require('../middleware/paramValidation');
const queryHandler = require('../middleware/queryHandler');
const bodyValidation = require('../middleware/bodyValidation');
const Event = require('../models/Event');

const { getEvents, getEvent, deleteEvent, createEvent, updateEvent } = events;

router
  .route('/')
  .get(queryHandler(Event), getEvents)
  .post(imageHandler, bodyValidation(Event), createEvent);

router
  .route('/:id')
  .get(paramValidation, getEvent)
  .delete(paramValidation, deleteEvent)
  .put(paramValidation, imageHandler, bodyValidation(Event), updateEvent);

module.exports = router;
