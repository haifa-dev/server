/* eslint-disable node/no-unpublished-require */
const faker = require('faker');
const _ = require('lodash');
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const Event = require('../../models/Event');
const { removeImg } = require('../../utils/fileSystem');
const { generateEvent } = require('../../utils/generateData');

let request;

const { log, error } = console;

const establishConnection = async () => {
  try {
    request = supertest(app);
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    log('Connection to database established successfully');
  } catch (ex) {
    error(ex);
    process.exit(0);
  }
};

const terminateConnection = async () => {
  try {
    await sequelize.close();
    app.close();
  } catch (ex) {
    error(ex);
  }
};

const insertEvent = async () =>
  await Event.create(await generateEvent(), { include: { all: true } });

const insertEvents = async () => {
  const events = [];
  await Promise.all(
    _.times(10, async () => {
      events.push(await generateEvent());
    })
  );
  return await Event.bulkCreate(events, { include: { all: true } });
};

const destroyEvents = async () => {
  const events = await Event.findAll();
  await Promise.all(events.map(async event => await removeImg(event.image)));
  await Event.destroy({ where: {} });
};

describe('/api/events', () => {
  beforeAll(establishConnection);
  afterAll(terminateConnection);

  describe('GET /', () => {
    let events;
    beforeAll(async () => {
      events = await insertEvents();
    });
    afterAll(async () => await destroyEvents(events));

    it('should return all Events', async () => {
      const res = await request.get('/api/events');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(10);
    });

    it('should return offset 5 Events', async () => {
      const res = await request.get('/api/events?offset=5');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(5);
    });

    it('should return limit 2 Events', async () => {
      const res = await request.get('/api/events?limit=2');
      expect(res.body.length).toBe(2);
    });

    it('should return Events off set 5 and limited to 2', async () => {
      const res = await request.get('/api/events?limit=2&offset=5');
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /:id', () => {
    let event;
    beforeEach(async () => {
      event = await insertEvent();
    });
    afterEach(async () => await destroyEvents());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.get(`/api/events/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return a event if valid id is passed', async () => {
      const res = await request.get(`/api/events/${event.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', event.title);
      expect(res.body).toHaveProperty('description', event.description);
      expect(res.body).toHaveProperty('image', event.image);
      expect(res.body).toHaveProperty('location', event.location);
    });
  });

  describe('destroy /:id', () => {
    let event;
    beforeEach(async () => {
      event = await insertEvent();
    });
    afterEach(async () => await destroyEvents());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.delete(`/api/events/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return 204 after removing an image', async () => {
      const res = await request.delete(`/api/events/${event.id}`);
      expect(res.status).toBe(204);
    });
  });

  describe('POST /', () => {
    let event;
    let image;
    beforeEach(async () => {
      event = await generateEvent(true, 2);
      ({ image } = event);
    });
    afterEach(async () => {
      await removeImg(image);
      await destroyEvents();
    });

    it('should return 400 if project is invalid', async () => {
      try {
        const res = await request
          .post(`/api/events/`)
          .field('date', `${event.date}`)
          .field('description', event.description)
          .field('location', event.location)
          .field('tags[0][title]', event.tags[0].title)
          .field('tags[1][title]', event.tags[0].title)
          .attach('image', `public/${image}`);

        expect(res.status).toBe(400);
      } catch (err) {
        log(err);
      }
    });

    it('should return the project if it is valid', async () => {
      const res = await request

        .post(`/api/events/`)
        .field('date', `${event.date}`)
        .field('title', event.title)
        .field('description', event.description)
        .field('location', event.location)
        .field('tags[0][title]', event.tags[0].title)
        .field('tags[1][title]', event.tags[0].title)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(201);
    });
  });

  describe('PUT /:id', () => {
    let newEvent;
    let event;
    let image;
    beforeEach(async () => {
      event = await insertEvent();
      newEvent = await generateEvent(true, 2);
      ({ image } = newEvent);
    });
    afterEach(async () => {
      await removeImg(image);
      await destroyEvents();
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request
        .put(`/api/events/${faker.random.uuid()}`)
        .field('date', `${newEvent.date}`)
        .field('title', newEvent.title)
        .field('description', newEvent.description)
        .field('location', newEvent.location)
        .field('tags[0][title]', newEvent.tags[0].title)
        .field('tags[1][title]', newEvent.tags[0].title)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(404);
    });

    it('should return 400 if project is invalid', async () => {
      const res = await request
        .put(`/api/events/${event.id}`)
        .field('date', `${newEvent.date}`)
        // .field('title', event.title)
        .field('description', newEvent.description)
        .field('location', newEvent.location)
        .field('tags[0][title]', newEvent.tags[0].title)
        .field('tags[1][title]', newEvent.tags[0].title)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(400);
    });

    it('should return the project if it is valid', async () => {
      const res = await request
        .put(`/api/events/${event.id}`)
        .field('date', `${newEvent.date}`)
        .field('title', newEvent.title)
        .field('description', newEvent.description)
        .field('location', newEvent.location)
        .field('tags[0][title]', newEvent.tags[0].title)
        .field('tags[1][title]', newEvent.tags[0].title)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(200);
    });
  });
});
