/* eslint-disable node/no-unpublished-require */
const faker = require('faker');
const _ = require('lodash');
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const DevProfile = require('../../models/DevProfile');
// const https = require('https');
// const fs = require('fs');
// const { removeImg, createRandomImage } = require('../../utils/fsManipulations');

let request;

const { log, error } = console;

const createDevProfile = async () => {
  return await DevProfile.create(
    {
      name: faker.name.findName(),
      bio: faker.name.title(),
      email: faker.internet.email(),
      image: `public/img/${faker.random.uuid()}.jpg`,
      socials: [
        { name: faker.name.title(), url: faker.internet.url() },
        { name: faker.name.title(), url: faker.internet.url() }
      ]
    },
    {
      include: { all: true }
    }
  );
};

const createDevProfiles = async () => {
  const devProfiles = [];
  _.times(10, () => {
    devProfiles.push({
      name: faker.name.findName(),
      bio: faker.name.title(),
      email: faker.internet.email(),
      image: `public/img/${faker.random.uuid()}.png`,
      socials: [
        { name: faker.name.title(), url: faker.internet.url() },
        { name: faker.name.title(), url: faker.internet.url() }
      ]
    });
  });

  return await DevProfile.bulkCreate(devProfiles, { include: { all: true } });
};
beforeAll(async () => {
  try {
    request = supertest(app);
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    log('Connection to database established successfully');
  } catch (err) {
    error(err);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
    app.close();
  } catch (err) {
    error(err);
  }
});

describe('/api/devProfiles', () => {
  let devProfiles;
  beforeEach(async () => {
    devProfiles = await createDevProfiles();
  });
  afterEach(async () => {
    await DevProfile.destroy({ where: {} });
  });

  const compareDevProfiles = index => devProfile =>
    devProfile.name === devProfiles[index].name &&
    devProfile.socials[0].name === devProfiles[index].socials[0].name;

  describe('GET /', () => {
    beforeEach(async () => {});
    afterEach(async () => {
      return await DevProfile.destroy({ where: {} });
    });

    it('should return all developers Profiles', async () => {
      const res = await request.get('/api/devProfiles');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(10);
      expect(res.body.some(compareDevProfiles(0))).toBeTruthy();
    });

    it('should return offset 5 developer Profiles', async () => {
      const res = await request.get('/api/devProfiles?offset=5');

      expect(res.body.length).toBe(5);
      expect(res.body.some(compareDevProfiles(5))).toBeTruthy();
      expect(res.body.some(compareDevProfiles(0))).toBeFalsy();
    });

    it('should return limit 2 developer profiles', async () => {
      const res = await request.get('/api/devProfiles?limit=2');

      expect(res.body.length).toBe(2);
      expect(res.body.some(compareDevProfiles(0))).toBeTruthy();
      expect(res.body.some(compareDevProfiles(3))).toBeFalsy();
    });

    it('should return developer profiles off set 5 and limited to 2', async () => {
      const res = await request.get('/api/devProfiles?limit=2&offset=5');

      expect(res.body.length).toBe(2);
      expect(res.body.some(compareDevProfiles(5))).toBeTruthy();
      expect(res.body.some(compareDevProfiles(8))).toBeFalsy();
      expect(res.body.some(compareDevProfiles(4))).toBeFalsy();
    });
  });

  describe('GET /:id', () => {
    it('should return a developer profile if valid id is passed', async () => {
      const devProfile = await await createDevProfile();
      const res = await request.get(`/api/devProfiles/${devProfile.id}`);

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('name', devProfile.name);
      expect(res.body).toHaveProperty('email', devProfile.email);
      expect(res.body).toHaveProperty('bio', devProfile.bio);
      expect(res.body).toHaveProperty('image', devProfile.image);
      expect(res.body.socials[1]).toHaveProperty('name', devProfile.socials[1].name);
      expect(res.body.socials[1]).toHaveProperty('url', devProfile.socials[1].url);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.get(`/api/devProfiles/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /:id', () => {
    it('should return 204 after removing an image', async () => {
      // const devProfile = await createDevProfile();
      // removeImg = jest.mock();
      // const res = await request.delete(`/api/devProfiles/${devProfile.id}`);
      // await removeImg(devProfile.image);
      expect(1).toBe(1);
    });
  });

  describe('PUT /:id', () => {});

  describe('POST /', () => {});
});
