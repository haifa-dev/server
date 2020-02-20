const fs = require('fs');
const path = require('path');
const faker = require('faker');
const https = require('https');

/**
 * remove image from the given location
 * @param {*} imgPath image location in the project include public and img folders
 */

exports.removeImg = imgPath =>
  new Promise((res, rej) => {
    fs.unlink(path.join(__dirname, '..', imgPath), err => {
      if (err) rej(err);
      res();
    });
  });

exports.createRandomImage = () => {
  return new Promise((res, rej) => {
    try {
      const fileName = `public/img/${faker.random.uuid()}.jpg`;
      const file = fs.createWriteStream(fileName);
      const imageUrl = faker.image.avatar();
      https.get(imageUrl, response => {
        response.pipe(file);
        response.on('finish', () => {
          res();
        });
        response.on('error', err => {
          rej(err);
        });
      });
    } catch (err) {
      rej(err);
    }
  });
};
