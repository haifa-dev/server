const chalk = require('chalk');
const _ = require('lodash');

const { DevProfile, Event, Project, ProjectReq } = require('../../db');
const {
  generateDevProfile,
  generateEvent,
  generateProject,
  generateProjectReq
} = require('../../utils/generateData');

const { log, error } = console;

async function generateData() {
  try {
    const devProfiles = [];
    const events = [];
    const projects = [];
    const projectReqs = [];

    log(chalk.green(`Generate data.`));
    await Promise.all(
      _.times(5, async () => {
        devProfiles.push(await generateDevProfile());
        events.push(await generateEvent());
        projects.push(await generateProject());
        projectReqs.push(generateProjectReq());
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

async function destroyData() {
  const destroyAll = Model =>
    Model.destroy({
      where: {},
      truncate: true
    });

  await Promise.all([DevProfile, Event, Project, ProjectReq].map(destroyAll));
}

module.exports = {
  up: generateData,
  down: destroyData
};
