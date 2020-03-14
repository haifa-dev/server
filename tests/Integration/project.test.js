/* eslint-disable node/no-unpublished-require */
const faker = require('faker');
const _ = require('lodash');
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const { Project } = require('../../db');
const { removeImg } = require('../../utils/fileSystem');
const { generateProject } = require('../../utils/generateData');

const baseUrl = '/api/v1';
const url = `${baseUrl}/projects`;
let request;

const { log, error } = console;

const establishConnection = async () => {
  request = supertest(app);
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  log('Connection to database established successfully');
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
  const Projects = [];
  await Promise.all(
    _.times(10, async () => {
      Projects.push(await generateProject());
    })
  );
  return await Project.bulkCreate(Projects, { include: { all: true } });
};

const destroyProjects = async () => {
  const Projects = await Project.findAll();
  await Promise.all(Projects.map(async project => await removeImg(project.image)));
  await Project.destroy({ where: {} });
};

describe(`${url}`, () => {
  beforeAll(establishConnection);
  afterAll(terminateConnection);

  describe('GET /', () => {
    let projects;
    beforeAll(async () => {
      projects = await insertProjects();
    });
    afterAll(async () => await destroyProjects(projects));

    it('should return all Projects', async () => {
      const res = await request.get(`${url}`);
      expect(res.status).toBe(200);
      expect(res.body.results).toBe(10);
    });

    it('should return limit 2 Projects', async () => {
      const res = await request.get(`${url}?limit=2`);
      expect(res.body.results).toBe(2);
    });

    it('should return Projects off set 5 and limited to 2', async () => {
      const res = await request.get(`${url}?limit=2&page=5`);
      expect(res.body.results).toBe(2);
    });
  });

  describe('GET /:id', () => {
    let project;
    beforeEach(async () => {
      project = await insertProject();
    });
    afterEach(async () => await destroyProjects());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.get(`${url}/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return a Project if valid id is passed', async () => {
      const res = await request.get(`${url}/${project.id}`);

      expect(res.status).toBe(200);
    });
  });

  describe('destroy /:id', () => {
    let project;
    beforeEach(async () => {
      project = await insertProject();
    });
    afterEach(async () => await destroyProjects());

    it('should return 404 if invalid id is passed', async () => {
      const res = await request.delete(`${url}/${faker.random.uuid()}`);
      expect(res.status).toBe(404);
    });

    it('should return 204 after removing an image', async () => {
      const res = await request.delete(`${url}/${project.id}`);
      expect(res.status).toBe(204);
    });
  });

  describe('POST /', () => {
    let project;
    let image;
    beforeEach(async () => {
      project = await generateProject(true, 2);
      ({ image } = project);
    });
    afterEach(async () => {
      await removeImg(image);
      await destroyProjects();
    });

    it('should return 400 if project is invalid', async () => {
      const res = await request
        .post(`${url}/`)
        // .field('title', `${project.title}`)
        .field('description', project.description)
        .field('tags[0][title]', project.tags[0].title)
        .field('tags[1][title]', project.tags[0].title)
        .field('links[0][name]', project.links[0].name)
        .field('links[0][url]', project.links[0].url)
        .field('links[1][name]', project.links[1].name)
        .field('links[1][url]', project.links[1].url)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(400);
    });

    it('should return the project if it is valid', async () => {
      const res = await request

        .post(`${url}/`)
        .field('title', `${project.title}`)
        .field('description', project.description)
        .field('tags[0][title]', project.tags[0].title)
        .field('tags[1][title]', project.tags[0].title)
        .field('links[0][name]', project.links[0].name)
        .field('links[0][url]', project.links[0].url)
        .field('links[1][name]', project.links[1].name)
        .field('links[1][url]', project.links[1].url)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(201);
    });
  });

  describe('PUT /:id', () => {
    let newProject;
    let project;
    let image;
    beforeEach(async () => {
      project = await insertProject();
      newProject = await generateProject(true, 2);
      ({ image } = newProject);
    });
    afterEach(async () => {
      await removeImg(image);
      await destroyProjects();
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request
        .put(`${url}/${faker.random.uuid()}`)
        .field('title', `${newProject.title}`)
        .field('description', newProject.description)
        .field('tags[0][title]', newProject.tags[0].title)
        .field('tags[1][title]', newProject.tags[0].title)
        .field('links[0][name]', newProject.links[0].name)
        .field('links[0][url]', newProject.links[0].url)
        .field('links[1][name]', newProject.links[1].name)
        .field('links[1][url]', newProject.links[1].url)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(404);
    });

    it('should return 400 if project is invalid', async () => {
      const res = await request
        .put(`${url}/${project.id}`)
        // .field('title', `${newProject.title}`)
        .field('description', newProject.description)
        .field('tags[0][title]', newProject.tags[0].title)
        .field('tags[1][title]', newProject.tags[0].title)
        .field('links[0][name]', newProject.links[0].name)
        .field('links[0][url]', newProject.links[0].url)
        .field('links[1][name]', newProject.links[1].name)
        .field('links[1][url]', newProject.links[1].url)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(400);
    });

    it('should return the project if it is valid', async () => {
      const res = await request
        .put(`${url}/${project.id}`)
        .field('title', `${newProject.title}`)
        .field('description', newProject.description)
        .field('tags[0][title]', newProject.tags[0].title)
        .field('tags[1][title]', newProject.tags[0].title)
        .field('links[0][name]', newProject.links[0].name)
        .field('links[0][url]', newProject.links[0].url)
        .field('links[1][name]', newProject.links[1].name)
        .field('links[1][url]', newProject.links[1].url)
        .attach('image', `public/${image}`);

      expect(res.status).toBe(200);
    });
  });
});
