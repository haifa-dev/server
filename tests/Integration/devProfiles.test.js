/* eslint-disable */
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const request = supertest(app);
const DevProfile = require('../../models/DevProfile');
const faker = require('faker');

beforeAll(async done => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  console.log('Connection to database established successfully');
  done();
});

afterAll(async done => {
  await sequelize.close();
  app.close();
  done();
});

describe('/api/devProfiles', () => {
  beforeEach(async done => {
    done();
  });
  afterEach(async () => {
    return await DevProfile.destroy({ where: {} });
  });

  describe('GET /', () => {
    it('should return all developers Profiles', async done => {
      let name;
      for (let i = 0; i < 10; i++) {
        name = faker.name.findName();
        await DevProfile.create(
          {
            name,
            bio: faker.name.title(),
            email: faker.internet.email(),
            image: `public/img/${faker.random.uuid()}.png`,
            socials: [{ name: faker.name.title(), url: faker.internet.url() }]
          },
          {
            include: { all: true }
          }
        );
      }

      const res = await request.get('/api/devProfiles');

      expect(res.body.length).toBe(10);
      expect(res.body.some(dp => dp.name === name)).toBeTruthy();
      done();
    });
  });

  describe('GET /:id', () => {
    it('should return a developer profile if valid id is passed', async done => {
      const devProfile = await DevProfile.create(
        {
          name: faker.name.findName(),
          bio: faker.name.title(),
          email: faker.internet.email(),
          image: `public/img/${faker.random.uuid()}.png`,
          socials: [{ name: faker.name.title(), url: faker.internet.url() }]
        },
        {
          include: { all: true }
        }
      );

      const res = await request.get('/api/devProfiles/' + devProfile.id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', devProfile.name);
      done();
    });

    it('should return 404 if invalid id is passed', async done => {
      const res = await request.get('/api/devProfiles/' + faker.random.uuid());
      expect(res.status).toBe(404);
      done();
    });
  });
});
