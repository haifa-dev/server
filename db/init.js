require('dotenv').config();
const _ = require('lodash');
const argv = require('argv');
const chalk = require('chalk');
const sequelize = require('../config/sequelize');
const { removeImgs } = require('../utils/fileSystem');
const { DevProfile, Event, Project, ProjectReq } = require('.');

// command line argument parsing
const { options } = argv
  .option([
    {
      name: 'range',
      short: 'r',
      type: 'csv,int',
      description: 'Defines the amount range of documents that generated per Model.',
      example: "'npm run db:create --range=5,6' or 'npm run db:create -r 3,6'"
    },
    {
      name: 'noData',
      type: 'boolean',
      short: 'N',
      description: 'Defines if included prevent data from being generated',
      example: "'npm run db:create --noData=5,6'"
    }
  ])
  .run();

const { range, noData } = options;

const {
  generateDevProfile,
  generateEvent,
  generateProject,
  generateProjectReq,
  generateNum
} = require('../utils/generateData');

const { log, error } = console;

/**
 * Generate Data and insert data to the database
 */
async function generateData() {
  try {
    const num = generateNum(range[0], range[1]);

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

    await DevProfile.bulkCreate(devProfiles, { include: { all: true } });
    await Event.bulkCreate(events, { include: { all: true } });
    await Project.bulkCreate(projects, { include: { all: true } });
    await ProjectReq.bulkCreate(projectReqs, { include: { all: true } });
    log(chalk.green('Generated data inserted'));
  } catch (ex) {
    error('Data generation failed\n', ex);
  }
}

/**
 * Generate, create and output root user with admin role.
 * @private
 */

(async () => {
  try {
    log(chalk.green('Verify database connection.'));
    await sequelize.authenticate();
    log(chalk.green('Clean img directory from files.'));
    await removeImgs();
    log(chalk.green('Synchronize database according to the models and drop existing tables'));
    await sequelize.sync({ force: true });
    if (!noData) await generateData();
    process.exit(0);
  } catch (err) {
    error(err);
  }
})();
