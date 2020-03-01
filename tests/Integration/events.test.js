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
    beforeAll(async () => {
      event = await insertEvent();
    });
    afterAll(async () => await destroyEvents());

    it('should return 400 if project is invalid', async () => {
      const res = await request
        .post(`/api/events/`)
        .field('title', faker.name.title())
        // .field('description', faker.lorem.paragraph())
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .field('links[0][name]', faker.name.findName())
        .field('links[0][url]', faker.internet.url())
        .field('links[1][name]', faker.name.findName())
        .field('links[1][url]', faker.internet.url())
        .attach('image', event.image);

      expect(res.status).toBe(400);
    });

    it('should return the project if it is valid', async () => {
      const res = await request
        .post(`/api/events/`)
        .field('date', `${faker.date.past(2)}`)
        .field('title', faker.name.title())
        .field('description', faker.lorem.paragraph())
        .field('location', `${faker.address.latitude()}, ${faker.address.longitude()}`)
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .attach('image', event.image);

      expect(res.status).toBe(201);
    });
  });

  describe('PUT /:id', () => {
    let event;
    beforeEach(async () => {
      event = await insertEvent();
    });
    afterEach(async () => await destroyEvents());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request
        .put(`/api/events/${faker.random.uuid()}`)
        .field('date', `${faker.date.past(2)}`)
        .field('title', faker.name.title())
        .field('description', faker.lorem.paragraph())
        .field('location', `${faker.address.latitude()}, ${faker.address.longitude()}`)
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .attach('image', event.image);

      expect(res.status).toBe(404);
    });

    it('should return 400 if project is invalid', async () => {
      const res = await request
        .put(`/api/events/${event.id}`)
        .field('date', `${faker.date.past(2)}`)
        // .field('title', faker.name.title())
        .field('description', faker.lorem.paragraph())
        .field('location', `${faker.address.latitude()}, ${faker.address.longitude()}`)
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .attach('image', event.image);

      expect(res.status).toBe(400);
    });

    it('should return the project if it is valid', async () => {
      const res = await request
        .put(`/api/events/${event.id}`)
        .field('date', `${faker.date.past(2)}`)
        .field('title', faker.name.title())
        .field('description', faker.lorem.paragraph())
        .field('location', `${faker.address.latitude()}, ${faker.address.longitude()}`)
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .attach('image', event.image);

      expect(res.status).toBe(200);
    });
  });
});
