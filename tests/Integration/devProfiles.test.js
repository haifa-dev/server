/* eslint-disable */
const request = require('supertest');
const DevProfile = require('../../models/DevProfile');

let server;

// NEED to configure eslint for *.test.js files
/**
 * TASK:: need to configure jest and adjust the server to start before jest runs the test files
 */

describe('/api/devProfiles', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(() => {
    // server && server.close();
  });

  describe('GET /', () => {
    it('should return all developers Profiles', async () => {
      const res = await request(server).get('/api/devProfiles');
      // expect(res.status).toBe(200);
    });
  });
});

/**
 * ERR:: the test runes before the server startup
 */
