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

module.exports = app => {
  // middleware
  app.use(helmet());
  app.use(express.json({ limit: 52428800 }));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(cors());
  app.options('*', cors());
  // routes
  app.use('/api/users', users);
  app.use('/api/devProfiles', devProfiles);
  app.use('/api/events', events);
  app.use('/api/projectReqs', projectReqs);
  app.use('/api/projects', projects);
  app.get('/test', notFound);
  app.all('*', notFound);
  app.use(error);
};
