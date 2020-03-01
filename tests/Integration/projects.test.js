/* eslint-disable node/no-unpublished-require */
const faker = require('faker');
const _ = require('lodash');
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const Project = require('../../models/Project');
const { removeImg } = require('../../utils/fileSystem');
const { generateProject } = require('../../utils/generateData');

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

const insertProject = async () =>
  await Project.create(await generateProject(), { include: { all: true } });

const insertProjects = async () => {
  const projects = [];
  await Promise.all(
    _.times(10, async () => {
      projects.push(await generateProject());
    })
  );
  return await Project.bulkCreate(projects, { include: { all: true } });
};

const destroyProjects = async () => {
  const projects = await Project.findAll();
  await Promise.all(projects.map(async project => await removeImg(project.image)));
  await Project.destroy({ where: {} });
};

describe('/api/projects', () => {
  beforeAll(establishConnection);
  afterAll(terminateConnection);

  describe('GET /', () => {
    let projects;
    beforeAll(async () => {
      projects = await insertProjects();
    });
    afterAll(async () => await destroyProjects(projects));

    it('should return all projects', async () => {
      const res = await request.get('/api/projects');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(10);
    });

    it('should return offset 5 projects', async () => {
      const res = await request.get('/api/projects?offset=5');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(5);
    });

    it('should return limit 2 projects', async () => {
      const res = await request.get('/api/projects?limit=2');
      expect(res.body.length).toBe(2);
    });

    it('should return projects off set 5 and limited to 2', async () => {
      const res = await request.get('/api/projects?limit=2&offset=5');
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /:id', () => {
    let project;
    beforeEach(async () => {
      project = await insertProject();
    });
    afterEach(async () => await destroyProjects());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.get(`/api/projects/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return a project if valid id is passed', async () => {
      const res = await request.get(`/api/projects/${project.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', project.title);
      expect(res.body).toHaveProperty('description', project.description);
      expect(res.body).toHaveProperty('image', project.image);
    });
  });

  describe('destroy /:id', () => {
    let project;
    beforeEach(async () => {
      project = await insertProject();
    });
    afterEach(async () => await destroyProjects());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.delete(`/api/projects/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return 204 after removing an image', async () => {
      const res = await request.delete(`/api/projects/${project.id}`);
      expect(res.status).toBe(204);
    });
  });

  describe('POST /', () => {
    let project;
    beforeAll(async () => {
      project = await insertProject();
    });
    afterAll(async () => await destroyProjects());

    it('should return 400 if project is invalid', async () => {
      const res = await request
        .post(`/api/projects/`)
        .field('title', faker.name.title())
        // .field('description', faker.lorem.paragraph())
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .field('links[0][name]', faker.name.findName())
        .field('links[0][url]', faker.internet.url())
        .field('links[1][name]', faker.name.findName())
        .field('links[1][url]', faker.internet.url())
        .attach('image', project.image);

      expect(res.status).toBe(400);
    });

    it('should return the project if it is valid', async () => {
      const res = await request
        .post(`/api/projects/`)
        .field('title', faker.name.title())
        .field('description', faker.lorem.paragraph())
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .field('links[0][name]', faker.name.findName())
        .field('links[0][url]', faker.internet.url())
        .field('links[1][name]', faker.name.findName())
        .field('links[1][url]', faker.internet.url())
        .attach('image', project.image);

      expect(res.status).toBe(201);
    });
  });

  describe('PUT /:id', () => {
    let project;
    beforeEach(async () => {
      project = await insertProject();
    });
    afterEach(async () => await destroyProjects());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request
        .put(`/api/projects/${faker.random.uuid()}`)
        .field('title', faker.name.title())
        .field('description', faker.lorem.paragraph())
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .field('links[0][name]', faker.name.findName())
        .field('links[0][url]', faker.internet.url())
        .field('links[1][name]', faker.name.findName())
        .field('links[1][url]', faker.internet.url())
        .attach('image', project.image);

      expect(res.status).toBe(404);
    });

    it('should return 400 if project is invalid', async () => {
      const res = await request
        .put(`/api/projects/${project.id}`)
        .field('title', faker.name.title())
        // .field('description', faker.lorem.paragraph())
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .field('links[0][name]', faker.name.findName())
        .field('links[0][url]', faker.internet.url())
        .field('links[1][name]', faker.name.findName())
        .field('links[1][url]', faker.internet.url())
        .attach('image', project.image);

      expect(res.status).toBe(400);
    });

    it('should return the project if it is valid', async () => {
      const res = await request
        .put(`/api/projects/${project.id}`)
        .field('title', faker.name.title())
        .field('description', faker.lorem.paragraph())
        .field('tags[0][title]', faker.name.title())
        .field('tags[1][title]', faker.name.title())
        .field('links[0][name]', faker.name.findName())
        .field('links[0][url]', faker.internet.url())
        .field('links[1][name]', faker.name.findName())
        .field('links[1][url]', faker.internet.url())
        .attach('image', project.image);

      expect(res.status).toBe(200);
    });
  });
});
