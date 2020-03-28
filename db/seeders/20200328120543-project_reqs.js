const faker = require('faker');
const _ = require('lodash');

const generateNum = (maxNum = 4, minNum = 1) => Math.round(Math.random() * maxNum + minNum);

module.exports = {
  up: queryInterface => {
    const devProfiles = [];

    _.times(generateNum(), async () => {
      devProfiles.push({
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        date: faker.date.future(generateNum()),
        content: faker.lorem.paragraph(generateNum()),
        submitted_by: faker.name.findName()
      });
    });

    return queryInterface.bulkInsert('project_reqs', devProfiles);
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('project_reqs', null, {});
  }
};
