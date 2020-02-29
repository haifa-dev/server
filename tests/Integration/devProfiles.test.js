/* eslint-disable node/no-unpublished-require */
const faker = require('faker');
const _ = require('lodash');
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const DevProfile = require('../../models/DevProfile');
const { removeImg, createRandomImage } = require('../../utils/FileSystem');
const fs = require('fs');
const util = require('util');

let request;

const { log, error } = console;

const insertDevProfile = async () => {
  return await DevProfile.create(
    {
      name: faker.name.findName(),
      bio: faker.lorem.paragraph(),
      email: faker.internet.email(),
      image: (await createRandomImage()) || `public/img/${faker.random.uuid()}.jpg`,
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

const destroyDevProfile = async devProfile => {
  removeImg(devProfile.image);
  return await devProfile.destroy();
};

const insertDevProfiles = async () => {
  const devProfiles = [];
  _.times(10, () => {
    devProfiles.push({
      name: faker.name.findName(),
      bio: faker.lorem.paragraph(),
      email: faker.internet.email(),
      image: `public/img/${faker.random.uuid()}.png`,
      socials: [
        { name: faker.name.title(), url: faker.internet.url() },
        { name: faker.name.title(), url: faker.internet.url() }
      ]
    });
  });
  devProfiles.forEach(devProfile => createRandomImage(devProfile.image));
  return await DevProfile.bulkCreate(devProfiles, { include: { all: true } });
};

const destroyDevProfiles = async devProfiles => {
  devProfiles.forEach(devProfile => removeImg(devProfile.image));
  await DevProfile.destroy({ where: {} });
};

const establishConnection = async () => {
  try {
    request = supertest(app);
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    log('Connection to database established successfully');
  } catch (ex) {
    error(ex);
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

beforeAll(establishConnection);
afterAll(terminateConnection);

describe('/api/devProfiles', () => {
  let devProfiles;
  beforeEach(async () => {
    devProfiles = await insertDevProfiles();
  });
  afterEach(async () => {
    await destroyDevProfiles(devProfiles);
  });

  const compareDevProfiles = index => devProfile =>
    devProfile.name === devProfiles[index].name &&
    devProfile.socials[0].name === devProfiles[index].socials[0].name;

  describe('GET /', () => {
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
    let devProfile;
    beforeEach(async () => {
      devProfile = await insertDevProfile();
    });
    afterEach(async () => {
      await destroyDevProfile(devProfile);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.get(`/api/devProfiles/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return a developer profile if valid id is passed', async () => {
      const res = await request.get(`/api/devProfiles/${devProfile.id}`);

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('name', devProfile.name);
      expect(res.body).toHaveProperty('email', devProfile.email);
      expect(res.body).toHaveProperty('bio', devProfile.bio);
      expect(res.body).toHaveProperty('image', devProfile.image);
      expect(res.body.socials[1]).toHaveProperty('name', devProfile.socials[1].name);
      expect(res.body.socials[1]).toHaveProperty('url', devProfile.socials[1].url);
    });
  });

  describe('destroy /:id', () => {
    let devProfile;
    beforeEach(async () => {
      devProfile = await insertDevProfile();
    });
    afterEach(async () => {
      fs.access(devProfile.image, async err => {
        if (!err) {
          await destroyDevProfile(devProfile);
        }
      });
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.get(`/api/devProfiles/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return 204 after removing an image', async () => {
      const res = await request.delete(`/api/devProfiles/${devProfile.id}`);
      expect(res.status).toBe(204);
    });
  });

  describe('PUT /:id', () => {
    let oldDevProfile, newDevProfile;
    beforeEach(async () => {
      oldDevProfile = await insertDevProfile();
      newDevProfile = {
        name: faker.name.findName(),
        bio: faker.lorem.paragraph(),
        email: faker.internet.email(),
        image: (await createRandomImage()) || `public/img/${faker.random.uuid()}.jpg`,
        socials: [
          { name: faker.name.title(), url: faker.internet.url() },
          { name: faker.name.title(), url: faker.internet.url() }
        ]
      };
    });
    afterEach(async () => {
      fs.access(oldDevProfile.image, async err => {
        if (!err) {
          await destroyDevProfile(oldDevProfile);
        }
      });

      fs.access(newDevProfile.image, async err => {
        if (!err) {
          await removeImg(newDevProfile.image);
        }
      });
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request
        .put(`/api/devProfiles/${faker.random.uuid()}`)
        .field('name', newDevProfile.name)
        .field('bio', newDevProfile.bio)
        .field('email', newDevProfile.email)
        .field('socials[0][name]', newDevProfile.socials[0].name)
        .field('socials[0][url]', newDevProfile.socials[0].url)
        .field('socials[1][name]', newDevProfile.socials[1].name)
        .field('socials[1][url]', newDevProfile.socials[1].url)
        .attach('image', newDevProfile.image);

      expect(res.status).toBe(404);
    });

    it('should return 404 if invalid image is passed', async () => {
      const res = await request
        .put(`/api/devProfiles/${faker.random.uuid()}`)
        .field('name', newDevProfile.name)
        .field('bio', newDevProfile.bio)
        .field('email', newDevProfile.email)
        .field('socials[0][name]', newDevProfile.socials[0].name)
        .field('socials[0][url]', newDevProfile.socials[0].url)
        .field('socials[1][name]', newDevProfile.socials[1].name)
        .field('socials[1][url]', newDevProfile.socials[1].url);

      expect(res.status).toBe(422);
    });

    it('should return 400 if invalid field is passed', async () => {
      const res = await request
        .put(`/api/devProfiles/${oldDevProfile.id}`)
        .field('name', newDevProfile.name)
        .field('bio', newDevProfile.bio)
        // .field('email', newDevProfile.email)
        .field('socials[0][name]', newDevProfile.socials[0].name)
        .field('socials[0][url]', newDevProfile.socials[0].url)
        .field('socials[1][name]', newDevProfile.socials[1].name)
        .field('socials[1][url]', newDevProfile.socials[1].url)
        .attach('image', newDevProfile.image);

      expect(res.status).toBe(400);
    });

    it('should return a developer profile', async () => {
      const res = await request
        .put(`/api/devProfiles/${oldDevProfile.id}`)
        .field('name', newDevProfile.name)
        .field('bio', newDevProfile.bio)
        .field('email', newDevProfile.email)
        .field('socials[0][name]', newDevProfile.socials[0].name)
        .field('socials[0][url]', newDevProfile.socials[0].url)
        .field('socials[1][name]', newDevProfile.socials[1].name)
        .field('socials[1][url]', newDevProfile.socials[1].url)
        .attach('image', newDevProfile.image);

      const updateDevProfile = await DevProfile.findByPk(oldDevProfile.id);
      expect(res.status).toBe(200);
      expect(updateDevProfile).toHaveProperty('email', newDevProfile.email);
      // expect(res.body).toHaveProperty('email', newDevProfile.email);
    });
  });

  describe('POST /', () => {
    let devProfile;

    beforeAll(async () => {
      devProfile = {
        name: faker.name.findName(),
        bio: faker.lorem.paragraph(),
        email: faker.internet.email(),
        image: (await createRandomImage()) || `public/img/${faker.random.uuid()}.jpg`,
        socials: [
          { name: faker.name.title(), url: faker.internet.url() },
          { name: faker.name.title(), url: faker.internet.url() }
        ]
      };
    });
    afterAll(async () => {
      (await util.promisify(fs.access)(devProfile.image)) && (await removeImg(devProfile.image));
      await devProfile.destroy({ where: {} });
    });

    it('should return 400 if DevProfile is invalid', async () => {
      const res = await request
        .post(`/api/DevProfiles/`)
        .field('name', devProfile.name)
        .field('bio', devProfile.bio)
        // .field('email', devProfile.email)
        .field('socials[0][name]', devProfile.socials[0].name)
        .field('socials[0][url]', devProfile.socials[0].url)
        .field('socials[1][name]', devProfile.socials[1].name)
        .field('socials[1][url]', devProfile.socials[1].url)
        .attach('image', devProfile.image);

      expect(res.status).toBe(400);
    });

    it('should return the DevProfile if it is valid', async () => {
      const res = await request
        .post(`/api/DevProfiles/`)
        .field('name', devProfile.name)
        .field('bio', devProfile.bio)
        .field('email', devProfile.email)
        .field('socials[0][name]', devProfile.socials[0].name)
        .field('socials[0][url]', devProfile.socials[0].url)
        .field('socials[1][name]', devProfile.socials[1].name)
        .field('socials[1][url]', devProfile.socials[1].url)
        .attach('image', devProfile.image);

      expect(res.status).toBe(201);
    });
  });
});
