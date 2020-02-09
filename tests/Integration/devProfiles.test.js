/* eslint-disable */
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const request = supertest(app);
const DevProfile = require('../../models/DevProfile');

beforeAll(async done => {
  await sequelize.authenticate();
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
    await sequelize.sync({ force: true });
    console.log('Database drop and recreate all tables.');
    done();
  });
  afterEach(() => {});

  describe('GET /', () => {
    it('should return all developers Profiles', async done => {
      await DevProfile.create(
        {
          name: 'test',
          bio: 'regfewrhrewhrwhrw',
          email: 'sergfwfffafay@rgmail.com',
          image: 'public/img/99560482-731a-4c17-bbde-9a6239581957.png',
          socials: [{ name: 'test', url: 'https://www.facebook.com/fegeg' }]
        },
        {
          include: { all: true }
        }
      );
      const res = await request.get('/api/devProfiles');

      expect(res.body.length).toBe(1);
      expect(res.body.some(devProfile => devProfile.name === 'test')).toBeTruthy();
      done();
    });
  });

  describe('GET /:id', () => {
    it('should return a developer profile if valid id is passed', async done => {
      const devProfile = await DevProfile.create(
        {
          name: 'test',
          bio: 'regfewrhrewhrwhrw',
          email: 'sergfwafffafay@rgmail.com',
          image: 'public/img/99560482-731a-4c17-bbde-9a6239581957.png',
          socials: [{ name: 'test', url: 'https://www.facebook.com/fegeg' }]
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

    // it('should return 404 if invalid id is passed', async done => {
    //   // console.log(process.env.NODE_ENV, process.env.DATABASE);
    //   try {
    //     const res = await request.get('/api/devProfiles/invalid_id');
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   // const res = await request.get('/api/tjtej/');
    //   // console.log(res.body);

    //   // expect(res.error.statusCode).toBe(404);
    //   done();
    // });
  });
});
