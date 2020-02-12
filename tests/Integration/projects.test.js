/* eslint-disable */
const supertest = require('supertest');
const app = require('../../index');
const sequelize = require('../../config/sequelize');
const request = supertest(app);
const DevProfile = require('../../models/DevProfile');
const faker = require('faker');

describe('/api/projects', () => {
  beforeEach(() => {});
  afterEach(() => {});

  describe('GET /', () => {});

  describe('GET /:id', () => {});

  describe('POST /', () => {});

  describe('PUT /:id', () => {});

  describe('DELETE / :id', () => {});
});
