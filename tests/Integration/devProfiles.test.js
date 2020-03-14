/* eslint-disable node/no-unpublished-require */
const faker = require('faker');
const _ = require('lodash');
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const { DevProfile } = require('../../db');
const { removeImg } = require('../../utils/fileSystem');
const { generateDevProfile } = require('../../utils/generateData');

const baseUrl = '/api/v1';
const url = `${baseUrl}/devProfiles`;

/** @type {import('supertest').SuperTest} */
let request;

const { log, error } = console;

const establishConnection = async () => {
  try {
    request = supertest(await app);
    log('Connection to database established successfully');
  } catch (ex) {
    error(ex);
    process.exit(1);
  }
};

const terminateConnection = async () => {
  try {
    await sequelize.close();
    (await app).close();
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

describe(`${url}`, () => {
  beforeAll(establishConnection);
  afterAll(terminateConnection);

  describe('GET /', () => {
    let devProfiles;
    beforeAll(async () => {
      devProfiles = await insertDevProfiles();
    });
    afterAll(async () => await destroyDevProfiles(devProfiles));

    it('should return all DevProfiles', async () => {
      const res = await request.get(`${url}`);
      expect(res.status).toBe(200);
      expect(res.body.results).toBe(10);
    });

    it('should return limit 2 DevProfiles', async () => {
      const res = await request.get(`${url}?limit=2`);
      expect(res.body.results).toBe(2);
    });

    it('should return DevProfiles off set 5 and limited to 2', async () => {
      const res = await request.get(`${url}?limit=2&page=5`);
      expect(res.body.results).toBe(2);
    });
  });

  describe('GET /:id', () => {
    let devProfile;
    beforeEach(async () => {
      devProfile = await insertDevProfile();
    });
    afterEach(async () => await destroyDevProfiles());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.get(`${url}/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return a DevProfile if valid id is passed', async () => {
      const res = await request.get(`${url}/${devProfile.id}`);

      expect(res.status).toBe(200);
    });
  });

  describe('destroy /:id', () => {
    let devProfile;
    beforeEach(async () => {
      devProfile = await insertDevProfile();
    });
    afterEach(async () => await destroyDevProfiles());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.delete(`${url}/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return 204 after removing an image', async () => {
      const res = await request.delete(`${url}/${devProfile.id}`);
      expect(res.status).toBe(204);
    });
  });

  describe('POST /', () => {
    let devProfile;
    let image;
    beforeEach(async () => {
      devProfile = await generateDevProfile(true, 2);
      ({ image } = devProfile);
    });
    afterEach(async () => {
      await removeImg(image);
      await destroyDevProfiles();
    });

    it('should return 400 if project is invalid', async () => {
      try {
        const res = await request
          .post(`${url}/`)
          .field('name', devProfile.name)
          .field('bio', devProfile.bio)
          // .field('email', devProfile.email)
          .field('socials[0][name]', devProfile.socials[0].name)
          .field('socials[0][url]', devProfile.socials[0].url)
          .field('socials[1][name]', devProfile.socials[1].name)
          .field('socials[1][url]', devProfile.socials[1].url)
          .attach('image', `public/${image}`);

        expect(res.status).toBe(400);
      } catch (err) {
        log(err);
      }
    });

    it('should return the project if it is valid', async () => {
      const res = await request
        .post(`${url}/`)
        .field('name', devProfile.name)
        .field('bio', devProfile.bio)
        .field('email', devProfile.email)
        .field('socials[0][name]', devProfile.socials[0].name)
        .field('socials[0][url]', devProfile.socials[0].url)
        .field('socials[1][name]', devProfile.socials[1].name)
        .field('socials[1][url]', devProfile.socials[1].url)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(201);
    });
  });

  describe('PUT /:id', () => {
    let newDevProfile;
    let devProfile;
    let image;
    beforeEach(async () => {
      devProfile = await insertDevProfile();
      newDevProfile = await generateDevProfile(true, 2);
      ({ image } = newDevProfile);
    });
    afterEach(async () => {
      await removeImg(image);
      await destroyDevProfiles();
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request
        .put(`${url}/${faker.random.uuid()}`)
        .field('name', newDevProfile.name)
        .field('bio', newDevProfile.bio)
        .field('email', newDevProfile.email)
        .field('socials[0][name]', newDevProfile.socials[0].name)
        .field('socials[0][url]', newDevProfile.socials[0].url)
        .field('socials[1][name]', newDevProfile.socials[1].name)
        .field('socials[1][url]', newDevProfile.socials[1].url)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(404);
    });

    it('should return 400 if project is invalid', async () => {
      const res = await request
        .put(`${url}/${devProfile.id}`)
        .field('name', newDevProfile.name)
        .field('bio', newDevProfile.bio)
        // .field('email', newDevProfile.email)
        .field('socials[0][name]', newDevProfile.socials[0].name)
        .field('socials[0][url]', newDevProfile.socials[0].url)
        .field('socials[1][name]', newDevProfile.socials[1].name)
        .field('socials[1][url]', newDevProfile.socials[1].url)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(400);
    });

    it('should return the project if it is valid', async () => {
      const res = await request
        .put(`${url}/${devProfile.id}`)
        .field('name', newDevProfile.name)
        .field('bio', newDevProfile.bio)
        .field('email', newDevProfile.email)
        .field('socials[0][name]', newDevProfile.socials[0].name)
        .field('socials[0][url]', newDevProfile.socials[0].url)
        .field('socials[1][name]', newDevProfile.socials[1].name)
        .field('socials[1][url]', newDevProfile.socials[1].url)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(200);
    });
  });
});
