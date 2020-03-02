const faker = require('faker');
const _ = require('lodash');
const { generateImage } = require('./fileSystem');

const generateImageUrl = async (createImage = true, imageUrl) =>
  createImage ? await generateImage(imageUrl) : `img/${faker.random.uuid()}.jpg`;

const generateNum = (maxNum = 4, minNum = 1) => Math.round(Math.random() * maxNum + minNum);

exports.generateProject = async (
  withImage = true,
  numOfLinks = generateNum(),
  numOfTags = generateNum()
) => {
  const image = await generateImageUrl(withImage);
  const links = [];
  const tags = [];
  _.times(numOfLinks, () => {
    links.push({
      name: faker.internet.domainWord(),
      url: faker.internet.url()
    });
  });
  _.times(numOfTags, () => {
    tags.push({ title: faker.commerce.productAdjective() });
  });

  return {
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    image,
    links,
    tags
  };
};

exports.generateDevProfile = async (withImage = true, numOfSocialLinks = generateNum()) => {
  const image = await generateImageUrl(withImage);
  const socials = [];
  _.times(numOfSocialLinks, () => {
    socials.push({ name: faker.internet.domainName(), url: faker.internet.url() });
  });

  return {
    name: faker.name.findName(),
    bio: faker.name.jobDescriptor(),
    email: faker.internet.email(),
    image,
    socials
  };
};

exports.generateEvent = async (withImage = true, numOfTags = generateNum()) => {
  const image = await generateImageUrl(withImage);

  return {
    title: faker.name.title(),
    description: faker.lorem.paragraph(generateNum()),
    image,
    date: faker.date.past(2),
    location: `${faker.address.latitude()}, ${faker.address.longitude()}`,
    tags: _.times(numOfTags, () => ({ title: faker.commerce.productAdjective() }))
  };
};

exports.generateProjectReq = () => {
  return {
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    date: faker.date.future(generateNum()),
    content: faker.lorem.paragraph(generateNum()),
    submittedBy: faker.name.findName()
  };
};

exports.generateNum = generateNum;
