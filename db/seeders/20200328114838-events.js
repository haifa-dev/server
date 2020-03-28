const faker = require('faker');
const { v4 } = require('uuid');
const _ = require('lodash');
const { generateImage, removeImgs } = require('../../utils/fileSystem');

const generateNum = (maxNum = 4, minNum = 1) => Math.round(Math.random() * maxNum + minNum);

module.exports = {
  up: async queryInterface => {
    const events = [];
    const tags = [];

    await Promise.all(
      _.times(generateNum(), async () => {
        const id = v4();
        const image = await generateImage();
        events.push({
          id,
          title: faker.name.title(),
          description: faker.lorem.paragraph(generateNum()),
          image,
          date: faker.date.future(2),
          location: `${faker.address.latitude()}, ${faker.address.longitude()}`
        });

        _.times(generateNum(), () => {
          tags.push({
            title: faker.commerce.productAdjective(),
            tagged_id: id
          });
        });
      })
    );

    await queryInterface.bulkInsert('events', events);

    return await queryInterface.bulkInsert('tags', tags);
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('events', null, {});
    await removeImgs();
    return queryInterface.bulkDelete('tags', null, {});
  }
};
