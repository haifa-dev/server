const router = require('express').Router();

const devProfiles = require('./devProfiles');
const events = require('./events');
const projectReqs = require('./projectReqs');
const projects = require('./projects');
const notFound = require('./notFound');
const users = require('./users');

router.use('/users', users);
router.use('/devProfiles', devProfiles);
router.use('/events', events);
router.use('/projectReqs', projectReqs);
router.use('/projects', projects);

module.exports = {
  router,
  notFound
};
