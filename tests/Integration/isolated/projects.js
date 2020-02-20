/* eslint-disable */
const supertest = require('supertest');
const app = require('../../../index');
const sequelize = require('../../../config/sequelize');
const request = supertest(app);
const Project = require('../../../models/Project');
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

describe('/api/projects', () => {
  beforeEach(() => {});
  afterEach(() => {});

  describe('GET /', () => {
    try {
    //   const project = await Project.create(
    //     {
    //       name: faker.name.findName(),
    //       bio: faker.name.title(),
    //       email: faker.internet.email(),
    //       image: `public/img/${faker.random.uuid()}.png`,
    //       links: [{ name: faker.name.title(), url: faker.internet.url() }],
    //       tags: [{ title: faker.name.title() }]
    //     },
    //     {
    //       include: { all: true }
    //     }
    //   );

      expect(1).toBe(1);
    } catch (err) {}
  });

  describe('GET /:id', () => {
    try {
      expect(1).toBe(1);
    } catch (err) {}
  });

  describe('POST /', () => {
    try {
      expect(1).toBe(1);
    } catch (err) {}
  });

  describe('PUT /:id', () => {
    try {
      expect(1).toBe(1);
    } catch (err) {}
  });

  describe('DELETE / :id', () => {
    try {
      expect(1).toBe(1);
    } catch (err) {}
  });
});
