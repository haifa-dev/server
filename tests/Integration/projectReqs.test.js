/* eslint-disable node/no-unpublished-require */
const faker = require('faker');
const _ = require('lodash');
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const ProjectReq = require('../../models/ProjectReq');
const { generateProjectReq } = require('../../utils/generateData');

const baseUrl = '/api/v1';
const url = `${baseUrl}/projectReqs`;
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
    process.exit(1);
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

const insertProjectReq = async () => await ProjectReq.create(await generateProjectReq());

const insertProjectReqs = async () => {
  const projectReqs = [];

  _.times(10, async () => {
    projectReqs.push(generateProjectReq());
  });

  return await ProjectReq.bulkCreate(projectReqs);
};

const destroyProjectReqs = async () => await ProjectReq.destroy({ where: {} });
describe(`${url}`, () => {
  beforeAll(establishConnection);
  afterAll(terminateConnection);

  describe('GET /', () => {
    beforeAll(async () => await insertProjectReqs());
    afterAll(async () => await destroyProjectReqs());

    it('should return all ProjectReqs', async () => {
      const res = await request.get(`${url}`);
      expect(res.status).toBe(200);
      expect(res.body.results).toBe(10);
    });

    it('should return limit 2 ProjectReqs', async () => {
      const res = await request.get(`${url}?limit=2`);
      expect(res.body.results).toBe(2);
    });

    it('should return ProjectReqs off set 5 and limited to 2', async () => {
      const res = await request.get(`${url}?limit=2&page=5`);
      expect(res.body.results).toBe(2);
    });
  });

  describe('GET /:id', () => {
    let projectReq;
    beforeEach(async () => {
      projectReq = await insertProjectReq();
    });
    afterEach(async () => await destroyProjectReqs());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.get(`${url}/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return a ProjectReq if valid id is passed', async () => {
      const res = await request.get(`${url}/${projectReq.id}`);

      expect(res.status).toBe(200);
    });
  });

  describe('destroy /:id', () => {
    let projectReq;
    beforeEach(async () => {
      projectReq = await insertProjectReq();
    });
    afterEach(async () => await destroyProjectReqs());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.delete(`${url}/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return 204 after removing an image', async () => {
      const res = await request.delete(`${url}/${projectReq.id}`);
      expect(res.status).toBe(204);
    });
  });

  describe('POST /', () => {
    let projectReq;
    beforeEach(async () => {
      projectReq = await generateProjectReq();
    });
    afterEach(async () => {
      await destroyProjectReqs();
    });

    it('should return 400 if project is invalid', async () => {
      delete projectReq.email;

      const res = await request.post(`${url}/`).send(projectReq);

      expect(res.status).toBe(400);
    });

    it('should return the project if it is valid', async () => {
      const res = await request.post(`${url}/`).send(projectReq);

      expect(res.status).toBe(201);
    });
  });

  describe('PUT /:id', () => {
    let newProjectReq;
    let projectReq;
    beforeEach(async () => {
      projectReq = await insertProjectReq();
      newProjectReq = await generateProjectReq();
    });
    afterEach(async () => await destroyProjectReqs());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.put(`${url}/${faker.random.uuid()}`).send(newProjectReq);

      expect(res.status).toBe(404);
    });

    it('should return 400 if project is invalid', async () => {
      delete newProjectReq.email;
      const res = await request.put(`${url}/${projectReq.id}`).send(newProjectReq);

      expect(res.status).toBe(400);
    });

    it('should return the project if it is valid', async () => {
      const res = await request.put(`${url}/${projectReq.id}`).send(newProjectReq);

      expect(res.status).toBe(200);
    });
  });
});
