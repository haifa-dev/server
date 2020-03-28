const faker = require('faker');
const { v4 } = require('uuid');
const _ = require('lodash');
const { generateImage, removeImgs } = require('../../utils/fileSystem');

const generateNum = (maxNum = 4, minNum = 1) => Math.round(Math.random() * maxNum + minNum);

module.exports = {
  up: async queryInterface => {
    const devProfiles = [];
    const socials = [];

    await Promise.all(
      _.times(generateNum(), async () => {
        const id = v4();
        const image = await generateImage();
        devProfiles.push({
          id,
          name: faker.name.findName(),
          bio: faker.name.jobDescriptor(),
          email: faker.internet.email(),
          image
        });

        _.times(generateNum(), () => {
          socials.push({
            name: faker.internet.domainName(),
            url: faker.internet.url(),
            linkable_id: id
          });
        });
      })
    );

    await queryInterface.bulkInsert('dev_profiles', devProfiles);

    return await queryInterface.bulkInsert('links', socials);
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('dev_profiles', null, {});
    await removeImgs();
    return queryInterface.bulkDelete('links', null, {});
  }
};
