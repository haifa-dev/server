const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const error = require('../middleware/error');
const devProfiles = require('./devProfiles');
const events = require('./events');
const projectReqs = require('./projectReqs');
const projects = require('./projects');
const notFound = require('./notFound');
const users = require('./users');

const baseUrl = '/api/v1';

module.exports = app => {
  // middleware
  app.use(helmet());
  app.use(express.json({ limit: 52428800 }));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(cors());
  app.options('*', cors());
  // routes
  app.use(`${baseUrl}/users`, users);
  app.use(`${baseUrl}/devProfiles`, devProfiles);
  app.use(`${baseUrl}/events`, events);
  app.use(`${baseUrl}/projectReqs`, projectReqs);
  app.use(`${baseUrl}/projects`, projects);
  app.all('*', notFound);
  app.use(error);
};
