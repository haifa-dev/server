const fs = require('fs-extra');
const path = require('path');

/**
 * remove image from the given location
 * @param {*} imgPath image location in the project include public and img folders
 */

exports.removeImg = function removeImg(imgPath) {
  fs.unlink(path.join(__dirname, '..', imgPath), err => {
    if (err) throw err;
  });
};
