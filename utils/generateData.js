const crypto = require('crypto');
const faker = require('faker');
const _ = require('lodash');

const generateNum = (maxNum, minNum = 0) => Math.round(Math.random() * maxNum + minNum);

exports.generateAdmin = (name = 'root') => {
  return {
    name,
    email: faker.internet.email(name, 'user'),
    password: crypto
      .createHash('sha256')
      .update(crypto.randomBytes(32).toString('hex'))
      .digest('hex')
      .toString()
      .slice(-8),
    role: 'admin'
  };
};

exports.generateArr = (generateFunc, maxNum = 5, minNum) => {
  const arr = [];

  _.times(generateNum(maxNum, minNum), async num => {
    arr.push(generateFunc(num));
  });

  return arr;
};

const generateName = num =>
  num ? `demo-${num}:${faker.company.companyName()}` : faker.company.companyName();

const pickRandom = arr => arr[Math.random() * arr.length];

exports.generateProfitableProjectRequest = num => ({
  name: generateName(num),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  about: faker.lorem.text(),
  businessPlan: faker.commerce.productDescription(),
  systemDefinition: faker.internet.url(),
  communityOrProfit: pickRandom(['community', 'profit']),
  isFunded: faker.random.boolean()
});

exports.generateCharitableProjectRequest = num => ({
  name: generateName(num),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  about: faker.lorem.text(),
  description: faker.commerce.productDescription(),
  webAddress: faker.internet.url(),
  tasks: faker.name.jobDescriptor()
});

exports.generateNum = generateNum;
