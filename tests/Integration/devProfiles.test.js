/* eslint-disable node/no-unpublished-require */
const faker = require('faker');
const _ = require('lodash');
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const DevProfile = require('../../models/DevProfile');
const { removeImg } = require('../../utils/fileSystem');
const { generateDevProfile } = require('../../utils/generateData');

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

const insertDevProfile = async () =>
  await DevProfile.create(await generateDevProfile(), { include: { all: true } });

const insertDevProfiles = async () => {
  const devProfiles = [];
  await Promise.all(
    _.times(10, async () => {
      devProfiles.push(await generateDevProfile());
    })
  );
  return await DevProfile.bulkCreate(devProfiles, { include: { all: true } });
};

const destroyDevProfiles = async () => {
  const devProfiles = await DevProfile.findAll();
  await Promise.all(devProfiles.map(async devProfile => await removeImg(devProfile.image)));
  await DevProfile.destroy({ where: {} });
};

describe('/api/DevProfiles', () => {
  beforeAll(establishConnection);
  afterAll(terminateConnection);

  describe('GET /', () => {
    let devProfiles;
    beforeAll(async () => {
      devProfiles = await insertDevProfiles();
    });
    afterAll(async () => await destroyDevProfiles(devProfiles));

    it('should return all DevProfiles', async () => {
      const res = await request.get('/api/DevProfiles');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(10);
    });

    it('should return offset 5 DevProfiles', async () => {
      const res = await request.get('/api/DevProfiles?offset=5');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(5);
    });

    it('should return limit 2 DevProfiles', async () => {
      const res = await request.get('/api/DevProfiles?limit=2');
      expect(res.body.length).toBe(2);
    });

    it('should return DevProfiles off set 5 and limited to 2', async () => {
      const res = await request.get('/api/DevProfiles?limit=2&offset=5');
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /:id', () => {
    let devProfile;
    beforeEach(async () => {
      devProfile = await insertDevProfile();
    });
    afterEach(async () => await destroyDevProfiles());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.get(`/api/devProfiles/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return a DevProfile if valid id is passed', async () => {
      const res = await request.get(`/api/devProfiles/${devProfile.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', devProfile.title);
      expect(res.body).toHaveProperty('description', devProfile.description);
      expect(res.body).toHaveProperty('location', devProfile.location);
    });
  });

  describe('destroy /:id', () => {
    let devProfile;
    beforeEach(async () => {
      devProfile = await insertDevProfile();
    });
    afterEach(async () => await destroyDevProfiles());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.delete(`/api/devProfiles/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return 204 after removing an image', async () => {
      const res = await request.delete(`/api/devProfiles/${devProfile.id}`);
      expect(res.status).toBe(204);
    });
  });

  describe('POST /', () => {
    let devProfile;
    beforeAll(async () => {
      devProfile = await insertDevProfile();
    });
    afterAll(async () => await destroyDevProfiles());

    it('should return 400 if project is invalid', async () => {
      const res = await request
        .post(`/api/devProfiles/`)
        .field('name', faker.name.findName())
        .field('bio', faker.lorem.paragraph(2))
        // .field('email', faker.internet.email())
        .field('socials[0][name]', faker.company.companyName())
        .field('socials[0][url]', faker.internet.url())
        .field('socials[1][name]', faker.company.companyName())
        .field('socials[1][url]', faker.internet.url())
        .attach('image', `public/${devProfile.image}`);

      expect(res.status).toBe(400);
    });

    it('should return the project if it is valid', async () => {
      const res = await request
        .post(`/api/devProfiles/`)
        .field('name', faker.name.findName())
        .field('bio', faker.lorem.paragraph(2))
        .field('email', faker.internet.email())
        .field('socials[0][name]', faker.company.companyName())
        .field('socials[0][url]', faker.internet.url())
        .field('socials[1][name]', faker.company.companyName())
        .field('socials[1][url]', faker.internet.url())
        .attach('image', `public/${devProfile.image}`);

      expect(res.status).toBe(201);
    });
  });

  describe('PUT /:id', () => {
    let devProfile;
    beforeEach(async () => {
      devProfile = await insertDevProfile();
    });
    afterEach(async () => await destroyDevProfiles());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request
        .put(`/api/devProfiles/${faker.random.uuid()}`)
        .field('name', faker.name.findName())
        .field('bio', faker.lorem.paragraph(2))
        .field('email', faker.internet.email())
        .field('socials[0][name]', faker.company.companyName())
        .field('socials[0][url]', faker.internet.url())
        .field('socials[1][name]', faker.company.companyName())
        .field('socials[1][url]', faker.internet.url())
        .attach('image', `public/${devProfile.image}`);

      expect(res.status).toBe(404);
    });

    it('should return 400 if project is invalid', async () => {
      const res = await request
        .put(`/api/devProfiles/${devProfile.id}`)
        .field('name', faker.name.findName())
        .field('bio', faker.lorem.paragraph(2))
        // .field('email', faker.internet.email())
        .field('socials[0][name]', faker.company.companyName())
        .field('socials[0][url]', faker.internet.url())
        .field('socials[1][name]', faker.company.companyName())
        .field('socials[1][url]', faker.internet.url())
        .attach('image', `public/${devProfile.image}`);

      expect(res.status).toBe(400);
    });

    it('should return the project if it is valid', async () => {
      const res = await request
        .put(`/api/devProfiles/${devProfile.id}`)
        .field('date', `${faker.date.past(2)}`)
        .field('title', faker.name.title())
        .field('description', faker.lorem.paragraph())
        .field('location', `${faker.address.latitude()}, ${faker.address.longitude()}`)
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .attach('image', `public/${devProfile.image}`);

      expect(res.status).toBe(200);
    });
  });
});
