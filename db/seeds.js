// load environment variables
require('dotenv').config();
const _ = require('lodash');
const chalk = require('chalk');
const sequelize = require('../config/sequelize');
const DevProfile = require('../models/DevProfile');
const Event = require('../models/Event');
const ProjectReq = require('../models/ProjectReq');
const Project = require('../models/Project');
const { removeImgs } = require('../utils/fileSystem');
const {
  generateDevProfile,
  generateEvent,
  generateProject,
  generateProjectReq,
  generateNum
} = require('../utils/generateData');

const { log, error } = console;

(async () => {
  try {
    log(chalk.green('Verify database connection.'));
    await sequelize.authenticate();
    log(chalk.green('Clean img directory from files.'));
    await removeImgs();
    log(chalk.green('Synchronize database according to the models and drop existing tables'));
    await sequelize.sync({ force: true });

    const range = process.argv[2].replace('DATA_RANGE=', '').split(',');
    const num = generateNum(Number(range[0]), Number(range[1]));
    const devProfiles = [];
    const events = [];
    const projects = [];
    const projectReqs = [];

    log(chalk.green(`Generate data.`));
    await Promise.all(
      _.times(num, async () => {
        devProfiles.push(await generateDevProfile());
        events.push(await generateEvent());
        projects.push(await generateProject());
        projectReqs.push(await generateProjectReq());
      })
    );

    log(chalk.green('Insert data into the Database.'));
    await DevProfile.bulkCreate(devProfiles, { include: { all: true } });
    await Event.bulkCreate(events, { include: { all: true } });
    await Project.bulkCreate(projects, { include: { all: true } });
    await ProjectReq.bulkCreate(projectReqs, { include: { all: true } });
    log(chalk.green(`Finished database initialization.`));
    process.exit(0);
  } catch (err) {
    error(err);
  }
})();
