const { Event, Tag } = require('../db');
const ServerError = require('../utils/ServerError');

/**
 * get all the events
 */
exports.getEvents = async (req, res) => {
  const events = await Event.findAll(req.queryParams);

  res.send({
    status: 'Success',
    results: events.length,
    data: events
  });
};

/**
 * get event by id
 */
exports.getEvent = async (req, res) => {
  const event = await Event.findByPk(req.params.id);
  // validate if event exists
  if (!event) {
    throw new ServerError('The event with the given ID was not found.', 404);
  }
  res.status(200).json({
    status: 'Success',
    data: event
  });
};

/**
 * delete event by id
 */
exports.deleteEvent = async (req, res) => {
  // find a single user with the id
  const event = await Event.findByPk(req.params.id);
  await Tag.destroy({ where: { taggedId: req.params.id } });

  // validate dev profiles existence in the database
  if (!event) throw new ServerError('The event with the given ID was not found.', 404);

  await event.destroy();
  // send status if successes
  res.status(204).send({
    status: 'Success',
    data: null
  });
};

/**
 * create new event via request body
 */
exports.createEvent = async (req, res) => {
  const event = await Event.create(req.body, { include: { all: true } });
  res.status(201).send({
    status: 'Success',
    data: event
  });
};

exports.updateEvent = async (req, res) => {
  const event = await Event.findByPk(req.params.id, { include: { all: true } });
  // check if the event exists
  if (!event) throw new ServerError('The event with the given ID was not found.', 404);

  await Tag.destroy({ where: { taggedId: req.params.id } });

  if (req.body.tags) {
    req.body.tags.forEach(tag => {
      tag.taggedId = req.params.id;
    });
    await Tag.bulkCreate(req.body.tags);
  }

  await event.update(req.body);
  await event.reload({ include: { all: true } });

  res.send({
    status: 'Success',
    data: event
  });
};
