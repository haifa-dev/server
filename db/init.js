require('dotenv').config();
const _ = require('lodash');
const argv = require('argv');
const chalk = require('chalk');
const sequelize = require('../config/sequelize');
const { removeImgs } = require('../utils/fileSystem');
const { DevProfile, Event, Project, ProjectReq, User } = require('.');

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
      name: 'admin',
      short: 'a',
      type: 'boolean',
      description: 'Defines if admin generation will be executed ',
      example: "'npm run db:create --admin' or 'npm run db:create -a'"
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

const { range, admin, noData } = options;

const {
  generateDevProfile,
  generateEvent,
  generateProject,
  generateProjectReq,
  generateNum,
  generateAdmin
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
async function createRootUser() {
  const root = generateAdmin();
  await User.create(root);
  log(chalk.green('Admin user created, user details:'));
  log(chalk.green('name:'), root.name);
  log(chalk.green('email:'), root.email);
  log(chalk.green('password:'), root.password);
  log(chalk.green('role:'), root.role);
  log(chalk.red('Note: You prefer to keep those to yourself.'));
}

(async () => {
  try {
    log(chalk.green('Verify database connection.'));
    await sequelize.authenticate();
    log(chalk.green('Clean img directory from files.'));
    await removeImgs();
    log(chalk.green('Synchronize database according to the models and drop existing tables'));
    await sequelize.sync({ force: true });
    if (!noData) await generateData();
    if (admin) await createRootUser();
    process.exit(0);
  } catch (err) {
    error(err);
  }
})();
