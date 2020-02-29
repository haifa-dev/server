const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const { removeImg } = require('../utils/FileSystem');
const Tag = require('../models/Tag');

/**
 * get all the events can pass pagination
 * options offset and limit via query.
 */
exports.getEvents = async (req, res) => {
  const { offset, limit } = req.query;
  const eventParams = { subQuery: true, include: 'tags' };

  // checking for pagination query options
  if (offset) eventParams.offset = offset;
  if (limit) eventParams.limit = limit;

  const events = await Event.findAll(eventParams);

  res.send(events);
};

/**
 * get event by passing the primary key via the param id.
 */
exports.getEvent = async (req, res) => {
  const event = await Event.findByPk(req.params.id, {
    include: 'tags'
  });
  // validate if event exists
  if (!event) {
    throw new AppError('The event with the given ID was not found.', 404);
  }
  res.send(event);
};

/**
 * delete event by passing the primary key via the param id
 */
exports.deleteEvent = async (req, res) => {
  // find a single user with the id
  const event = await Event.findByPk(req.params.id);
  // validate dev profiles existence in the database
  if (!event) throw new AppError('The event with the given ID was not found.', 404);

  // delete the current event
  removeImg(event.image);
  await event.destroy();
  // send status if successes
  res.sendStatus(204);
};

exports.validateEvent = (req, res, next) => {
  //  user input validation
  const { error } = Event.validateAll(req.body);
  if (error) throw new AppError(error.details[0].message, 400);
  next();
};

/**
 * create new event via request body
 */
exports.createEvent = async (req, res) => {
  const event = await Event.create(req.body, { include: 'tags' });
  res.status(201).send(event);
};

exports.updateEvent = async (req, res) => {
  const event = await Event.findByPk(req.params.id, { include: 'tags' });
  // check if the event exists
  if (!event) throw new AppError('The event with the given ID was not found.', 404);

  removeImg(event.image);
  await Tag.destroy({ where: { EventId: req.params.id } });

  if (req.body.tags) {
    req.body.tags.forEach(tag => {
      tag.devProfileId = req.params.id;
    });
    await Tag.bulkCreate(req.body.tags);
  }

  // remove the old image
  await event.update(req.body);
  await event.reload({ include: 'tags' });

  res.send(event);
};
