/* eslint-disable node/no-unpublished-require */
const faker = require('faker');
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const ProjectReq = require('../../models/ProjectReq');

let request;

const { log, error } = console;

const createProjectReq = async () =>
  await ProjectReq.create({
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    date: faker.date.past(),
    content: faker.lorem.paragraph(),
    submittedBy: faker.name.title()
  });

const createProjectReqs = async () => {
  const ProjectReqs = [];
  for (let i = 0; i < 10; i++) {
    ProjectReqs.push({
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      date: faker.date.past(),
      content: faker.lorem.paragraph(),
      submittedBy: faker.name.title()
    });
  }
  return await ProjectReq.bulkCreate(ProjectReqs);
};
beforeAll(async () => {
  try {
    request = supertest(app);
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    log('Connection to database established successfully');
  } catch (ex) {
    error(ex);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
    app.close();
  } catch (ex) {
    error(ex);
  }
});

describe('/api/ProjectReqs', () => {
  describe('GET /', () => {
    let projectReqs;
    beforeEach(async () => {
      projectReqs = await createProjectReqs();
    });
    afterEach(async () => {
      await ProjectReq.destroy({ where: {} });
    });

    const compareProjectReqs = index => projectReq =>
      projectReq.submittedBy === projectReqs[index].submittedBy &&
      projectReq.email === projectReqs[index].email;

    it('should return all project requests', async () => {
      const res = await request.get('/api/projectReqs');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(10);
      expect(res.body.some(compareProjectReqs(0))).toBeTruthy();
    });

    it('should return offset 5 project requests', async () => {
      const res = await request.get('/api/projectReqs?offset=5');

      expect(res.body.length).toBe(5);
      expect(res.body.some(compareProjectReqs(5))).toBeTruthy();
      expect(res.body.some(compareProjectReqs(0))).toBeFalsy();
    });

    it('should return limit 2 project requests', async () => {
      const res = await request.get('/api/projectReqs?limit=2');

      expect(res.body.length).toBe(2);
      expect(res.body.some(compareProjectReqs(0))).toBeTruthy();
      expect(res.body.some(compareProjectReqs(3))).toBeFalsy();
    });

    it('should return project requests off set 5 and limited to 2', async () => {
      const res = await request.get('/api/projectReqs?limit=2&offset=5');

      expect(res.body.length).toBe(2);
      expect(res.body.some(compareProjectReqs(5))).toBeTruthy();
      expect(res.body.some(compareProjectReqs(8))).toBeFalsy();
      expect(res.body.some(compareProjectReqs(4))).toBeFalsy();
    });
  });

  describe('GET /:id', () => {
    let projectReq;
    beforeEach(async () => {
      projectReq = await createProjectReq();
    });
    afterEach(async () => {
      await ProjectReq.destroy({ where: {} });
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.get(`/api/ProjectReqs/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return a project request if valid id is passed', async () => {
      const res = await request.get(`/api/projectReqs/${projectReq.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', projectReq.email);
      expect(res.body).toHaveProperty('phone', projectReq.phone);
      // expect(res.body).toHaveProperty('date', projectReq.date);
      expect(res.body).toHaveProperty('content', projectReq.content);
      expect(res.body).toHaveProperty('submittedBy', projectReq.submittedBy);
    });
  });

  describe('DELETE /:id', () => {
    let projectReq;
    beforeEach(async () => {
      projectReq = await createProjectReq();
    });
    afterEach(async () => {
      await ProjectReq.destroy({ where: {} });
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.delete(`/api/ProjectReqs/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return 204 if valid id is passed', async () => {
      const res = await request.delete(`/api/projectReqs/${projectReq.id}`);
      expect(res.status).toBe(204);
    });
  });

  describe('POST /', () => {
    let newProjectReq;

    beforeEach(async () => {
      newProjectReq = {
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        date: faker.date.past(),
        content: faker.lorem.paragraph(),
        submittedBy: faker.name.title()
      };
    });
    afterEach(async () => {
      await ProjectReq.destroy({ where: {} });
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.post(`/api/ProjectReqs/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return 400 if invalid properties passed', async () => {
      const res = await request.post('/api/projectReqs/').send({
        email: faker.internet.email()
      });
      expect(res.status).toBe(400);
    });

    it('should return a project', async () => {
      const res = await request.post('/api/projectReqs/').send(newProjectReq);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('email', newProjectReq.email);
      expect(res.body).toHaveProperty('phone', newProjectReq.phone);
      // expect(res.body).toHaveProperty('date', newProjectReq.date);
      expect(res.body).toHaveProperty('content', newProjectReq.content);
      expect(res.body).toHaveProperty('submittedBy', newProjectReq.submittedBy);
    });
  });
  describe('PUT /', () => {
    let oldProjectReq;
    let newProjectReq;

    beforeEach(async () => {
      oldProjectReq = await createProjectReq();
      newProjectReq = {
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        date: faker.date.past(),
        content: faker.lorem.paragraph(),
        submittedBy: faker.name.title()
      };
    });
    afterEach(async () => {
      await ProjectReq.destroy({ where: {} });
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.put(`/api/projectReqs/${faker.random.uuid()}`).send(newProjectReq);

      expect(res.status).toBe(404);
    });

    it('should return 400 if invalid properties passed', async () => {
      delete newProjectReq.email;
      const res = await request.put(`/api/projectReqs/${oldProjectReq.id}`).send(newProjectReq);
      expect(res.status).toBe(400);
    });

    it('should return the updated genre if it is valid', async () => {
      const res = await request.put(`/api/projectReqs/${oldProjectReq.id}`).send(newProjectReq);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', newProjectReq.email);
      expect(res.body).toHaveProperty('phone', newProjectReq.phone);
      // expect(res.body).toHaveProperty('date', newProjectReq.date);
      expect(res.body).toHaveProperty('content', newProjectReq.content);
      expect(res.body).toHaveProperty('submittedBy', newProjectReq.submittedBy);
    });
  });
});
