const _ = require('lodash');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const { removeImg } = require('../utils/fsManipulations');

/**
 * get all the events from the database
 * can pass pagination options offset, limit
 * via req.query
 */
exports.getEvents = async (req, res) => {
  const { offset, limit } = req.query;
  let events;

  // checking for pagination query options
  if (offset && limit)
    events = await Event.findAndCountAll({ offset, limit, raw: true });
  else if (offset) events = await Event.findAndCountAll({ offset, raw: true });
  else if (limit) events = await Event.findAndCountAll({ limit, raw: true });
  else events = await Event.findAndCountAll({ raw: true });

  res.send(events);
};

/**
 * get a event by the primary key via the req.params.id
 */
exports.getEventByPK = async (req, res) => {
  // check if uuid isValid
  const { error } = Event.isUUID(req.params.id);
  if (error) throw new AppError(error.details[0].message, 400);

  const event = await Event.findByPk(req.params.id, { raw: true });
  // validate dev profiles existence in the database
  if (!event) {
    throw new AppError('The event with the given ID was not found.', 404);
  }
  res.send(event);
};

/**
 * remove a event if exists
 */
exports.deleteEventByPK = async (req, res) => {
  // check if uuid isValid
  const { error } = Event.isUUID(req.params.id);
  if (error) throw new AppError(error.details[0].message, 400);
  // find a single user with the id
  const event = await Event.findByPk(req.params.id);
  // validate dev profiles existence in the database
  if (!event) {
    throw new AppError('The event with the given ID was not found.', 404);
  }
  // delete the current event
  removeImg(event.image);
  await event.destroy();
  // send status if successes
  res.sendStatus(204);
};

/**
 * Create new event if valid
 */
exports.createEvent = async (req, res) => {
  // user image type validation via multer
  if (!req.file) throw new AppError('Attached file is not an image', 422);
  req.body.image = req.file.path;
  //  user input validation
  const { error } = await Event.validateAll(req.body);
  if (error) {
    removeImg(req.file.path);
    throw new AppError(error.details[0].message, 400);
  }

  const event = await Event.create(
    _.pick(req.body, ['date', 'title', 'image', 'description', 'location'])
  );
  res.status(201).send(event);
};

exports.updateEvent = async (req, res) => {
  // check if uuid isValid
  const { error: uuidError } = Event.isUUID(req.params.id);
  if (uuidError) {
    removeImg(req.file.path);
    throw new AppError(uuidError.details[0].message, 400);
  }
  // user image type validation via multer
  if (!req.file) throw new AppError('Attached file is not an image', 422);
  req.body.image = req.file.path;
  //  user input validation
  const { error } = await Event.validateAll(req.body);
  if (error) {
    removeImg(req.file.path);
    throw new AppError(error.details[0].message, 400);
  }
  const event = await Event.findByPk(req.params.id);
  // check if the event exists
  if (!event) {
    removeImg(req.file.path);
    throw new AppError('The event with the given ID was not found.', 404);
  }
  // remove the old image
  removeImg(event.image);
  await event.update(_.pick(req.body, ['email', 'name', 'image', 'bio']));

  res.send(event);
};
