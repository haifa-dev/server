const fs = require('fs');
const path = require('path');
const faker = require('faker');
const https = require('https');
const util = require('util');

/**
 * remove image from the given location
 * @param {*} imgPath image location in the project include public and img folders
 */

exports.removeImg = imgPath =>
  new Promise((res, rej) => {
    fs.unlink(path.join(__dirname, '..', imgPath), ex => {
      if (ex) rej(ex);
      res();
    });
  });

exports.createRandomImage = (imgPath = `public/img/${faker.random.uuid()}.jpg`) => {
  return new Promise((res, rej) => {
    try {
      const file = fs.createWriteStream(imgPath);
      const imageUrl = faker.image.avatar();
      https.get(imageUrl, response => {
        response.pipe(file);
        response.on('end', () => {
          res(imgPath);
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
