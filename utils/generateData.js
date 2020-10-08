const crypto = require('crypto');
const faker = require('faker');
const _ = require('lodash');

const generateNum = (maxNum, minNum) => Math.round(Math.random() * maxNum + minNum);

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

exports.generateCharitableProjectRequest = num => ({
  name: num ? `demo-${num}:${faker.company.companyName()}` : faker.company.companyName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  about: faker.lorem.text(),
  description: faker.commerce.productDescription(),
  webAddress: faker.internet.url(),
  tasks: faker.name.jobDescriptor()
});

exports.generateCharitableProjectRequests = (maxNum = 5, minNum = 4) => {
  const charitableProjectRequests = [];

  _.times(generateNum(maxNum, minNum), async num => {
    charitableProjectRequests.push(this.generateCharitableProjectRequest(num));
  });

  return charitableProjectRequests;
};

exports.generateNum = generateNum;
