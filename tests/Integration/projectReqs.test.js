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

describe('/api/ProjectReqs', () => {
  describe('GET /', () => {
    let projectReqs;
    beforeEach(async () => {
      projectReqs = await createProjectReqs();
    });
    afterEach(async () => {
      await ProjectReq.destroy({ where: {} });
    });za

    const compareProjectReqs = index => projectReq =>
      projectReq.submittedBy === projectReqs[index].submittedBy &&
      projectReq.email === projectReqs[index].email;

    afterEach(async () => {
      return await ProjectReq.destroy({ where: {} });
    });

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
    it('should return a project request if valid id is passed', async () => {
      const projectReq = await createProjectReq();
      const res = await request.get(`/api/projectReqs/${projectReq.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', projectReq.email);
      expect(res.body).toHaveProperty('phone', projectReq.phone);
      // expect(res.body).toHaveProperty('date', projectReq.date);
      expect(res.body).toHaveProperty('content', projectReq.content);
      expect(res.body).toHaveProperty('submittedBy', projectReq.submittedBy);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.get(`/api/ProjectReqs/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /:id', () => {
    it('should return 204 after removing an image', async () => {
      const projectReq = await createProjectReq();
      const res = await request.delete(`/api/projectReqs/${projectReq.id}`);
      expect(res.status).toBe(204);
    });
  });

  describe('POST /', () => {
    it('should return 400 if invalid properties passed', async () => {
      const res = await request.post('/api/projectReqs/').send({
        email: faker.internet.email()
      });
      expect(res.status).toBe(400);
    });

    it('should save the project request if it is valid', async () => {
      const res = await request.post('/api/projectReqs/').send({
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        date: faker.date.past(),
        content: faker.lorem.paragraph(),
        submittedBy: faker.name.findName()
      });

      const projectReq = await ProjectReq.findByPk(res.body.id);

      expect(projectReq).not.toBeNull();
      expect(res.status).toBe(201);
    });
  });

  describe('PUT /', () => {
    it('should return 404 if invalid id is passed', async () => {
      const res = await request.put(`/api/ProjectReqs/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });
    it('should return 400 if invalid properties passed', async () => {
      log(projectReqs);
      const res = await request.put(`/api/projectReqs/${projectReqs.id}`).send({
        email: faker.internet.email()
      });
      expect(res.status).toBe(400);
    });
  });

  // describe('PUT /:id', () => {
  //   it('should return 404 if invalid id is passed', async () => {
  //     const res = await request.put(`/api/ProjectReqs/${faker.random.uuid()}`);
  //     expect(res.status).toBe(404);
  //   });

  //   it('should return a project request if valid parameters passed', async () => {
  //     const projectReq = await createProjectReq();
  //     const body = {
  //       email: 'max@gmail.com',
  //       phone: '0523334562945',
  //       date: 'Monday, 17 February 2020',
  //       content:
  //         'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus reprehenderit eum nesciunt nostrum facilis, nulla atque, assumenda placeat corporis quidem quia modi architecto voluptates minus omnis, neque soluta ipsam molestias.',
  //       submittedBy: 'max'
  //     };
  //     const res = await request.put(`/api/projectReqs/${projectReq.id}`).send(body);
  //     log(res.body);

  //     // log(faker.date.past());

  //     expect(res.status).toBe(200);
  //     // expect(res.body).toHaveProperty('email', projectReq.email);
  //     // expect(res.body).toHaveProperty('phone', projectReq.phone);
  //     // expect(res.body).toHaveProperty('date', projectReq.date);
  //     // expect(res.body).toHaveProperty('content', projectReq.content);
  //     // expect(res.body).toHaveProperty('submittedBy', projectReq.submittedBy);
  //   });
  // });
});
