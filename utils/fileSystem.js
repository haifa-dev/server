const fs = require('fs');
const path = require('path');
const faker = require('faker');
const https = require('https');
const { promisify } = require('util');

const directory = 'public/img/';

/**
 * remove image from the given location
 * @param {*} imgPath image location in the project include public and img folders
 */
exports.removeImg = imgPath => promisify(fs.unlink)(path.join(__dirname, '..', 'public', imgPath));

exports.removeImgs = async () => {
  const files = await promisify(fs.readdir)(directory);

  files.forEach(file => {
    const gitKeep = /.gitkeep/;
    if (!gitKeep.test(file)) {
      promisify(fs.unlink)(path.join(directory, file));
    }
  });
};

exports.generateImage = (
  imageUrl = faker.image.avatar(),
  imgPath = `img/${faker.random.uuid()}.jpg`
) => {
  return new Promise((res, rej) => {
    try {
      const file = fs.createWriteStream(`public/${imgPath}`);
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
