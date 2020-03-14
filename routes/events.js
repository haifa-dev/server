const router = require('express').Router();
const { events } = require('../controllers');
const { Event } = require('../db');
const { imageHandler, paramValidation, queryHandler, bodyValidation } = require('../middleware');

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
