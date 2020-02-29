/* eslint-disable node/no-unpublished-require */
const fs = require('fs');
const util = require('util');
const faker = require('faker');
const _ = require('lodash');
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const Event = require('../../models/Event');
const { removeImg, createRandomImage } = require('../../utils/FileSystem');

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

describe('/api/events', () => {
  beforeAll(establishConnection);
  afterAll(terminateConnection);

  describe('GET /', () => {
    let events = [];
    beforeAll(async () => {
      _.times(10, () => {
        events.push({
          title: faker.name.findName(),
          description: faker.lorem.paragraph(),
          image: `public/img/${faker.random.uuid()}.jpg`,
          location: `${faker.address.latitude()}, ${faker.address.longitude()}`,
          tags: [{ title: faker.name.title() }, { title: faker.name.title() }]
        });
      });
      events.forEach(event => createRandomImage(event.image));
      events = await Event.bulkCreate(events, { include: { all: true } });
    });

    afterAll(async () => {
      events.forEach(event => removeImg(event.image));
      await Event.destroy({ where: {} });
    });
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
    beforeAll(async () => {
      event = await Event.create(
        {
          title: faker.name.findName(),
          date: faker.date.past(2),
          description: faker.lorem.paragraph(),
          image: (await createRandomImage()) || `public/img/${faker.random.uuid()}.jpg`,
          location: `${faker.address.latitude()}, ${faker.address.longitude()}`,
          tags: [{ title: faker.name.title() }, { title: faker.name.title() }]
        },
        {
          include: { all: true }
        }
      );
    });
    afterAll(async () => {
      await removeImg(event.image);
      await event.destroy({ where: {} });
    });

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
      expect(res.body.tags[0]).toHaveProperty('title', event.tags[0].title);
      expect(res.body.tags[1]).toHaveProperty('title', event.tags[1].title);
    });
  });

  describe('destroy /:id', () => {
    let event;
    beforeAll(async () => {
      event = await Event.create(
        {
          title: faker.name.findName(),
          date: faker.date.past(2),
          description: faker.lorem.paragraph(),
          image: (await createRandomImage()) || `public/img/${faker.random.uuid()}.jpg`,
          location: `${faker.address.latitude()}, ${faker.address.longitude()}`,
          tags: [{ title: faker.name.title() }, { title: faker.name.title() }]
        },
        {
          include: { all: true }
        }
      );
    });
    afterAll(async () => {
      (await util.promisify(fs.access)(event.image)) && (await removeImg(event.image));
      await event.destroy({ where: {} });
    });

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
      event = {
        title: faker.commerce.product(),
        description: faker.lorem.paragraph(),
        image: (await createRandomImage()) || `public/img/${faker.random.uuid()}.jpg`,
        links: [
          { name: faker.name.title(), url: faker.internet.url() },
          { name: faker.name.title(), url: faker.internet.url() }
        ],
        tags: [{ title: faker.name.title() }, { title: faker.name.title() }]
      };
    });
    afterAll(async () => {
      (await util.promisify(fs.access)(event.image)) && (await removeImg(event.image));
      await event.destroy({ where: {} });
    });

    it('should return 400 if event is invalid', async () => {
      const res = await request
        .post(`/api/events/`)
        .field('date', `${faker.date.past(2)}`)
        .field('title', faker.name.title())
        .field('description', faker.lorem.paragraph())
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .attach('image', event.image);

      expect(res.status).toBe(400);
    });

    it('should return the event if it is valid', async () => {
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
    beforeAll(async () => {
      event = await Event.create(
        {
          title: faker.commerce.product(),
          description: faker.lorem.paragraph(),
          image: (await createRandomImage()) || `public/img/${faker.random.uuid()}.jpg`,
          links: [
            { name: faker.name.title(), url: faker.internet.url() },
            { name: faker.name.title(), url: faker.internet.url() }
          ],
          tags: [{ title: faker.name.title() }, { title: faker.name.title() }]
        },
        {
          include: { all: true }
        }
      );
    });
    afterAll(async () => {
      await removeImg(event.image);
      await event.destroy({ where: {} });
    });

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

    it('should return 400 if event is invalid', async () => {
      const res = await request
        .put(`/api/events/${event.id}`)
        .field('date', `${faker.date.past(2)}`)
        .field('title', faker.name.title())
        // .field('description', faker.lorem.paragraph())
        .field('location', `${faker.address.latitude()}, ${faker.address.longitude()}`)
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .attach('image', event.image);

      expect(res.status).toBe(400);
    });

    it('should return the event if it is valid', async () => {
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
