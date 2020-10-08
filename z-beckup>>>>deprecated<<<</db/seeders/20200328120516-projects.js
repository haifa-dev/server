const faker = require('faker');
const { v4 } = require('uuid');
const _ = require('lodash');
const { generateImage, removeImgs } = require('../../utils/fileSystem');

const generateNum = (maxNum = 4, minNum = 1) => Math.round(Math.random() * maxNum + minNum);

module.exports = {
  up: async queryInterface => {
    const projects = [];
    const tags = [];
    const links = [];

    await Promise.all(
      _.times(generateNum(), async () => {
        const id = v4();
        const image = await generateImage();
        projects.push({
          id,
          title: faker.commerce.productName(),
          description: faker.lorem.paragraph(),
          image
        });

        _.times(generateNum(), () => {
          tags.push({
            title: faker.commerce.productAdjective(),
            tagged_id: id
          });

          links.push({
            name: faker.internet.domainName(),
            url: faker.internet.url(),
            linkable_id: id
          });
        });
      })
    );

    await queryInterface.bulkInsert('projects', projects);
    await queryInterface.bulkInsert('links', links);
    return await queryInterface.bulkInsert('tags', tags);
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('projects', null, {});
    await removeImgs();
    await queryInterface.bulkDelete('links', null, {});
    return queryInterface.bulkDelete('tags', null, {});
  }
};
