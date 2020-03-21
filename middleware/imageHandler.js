const multer = require('multer');
const { v4 } = require('uuid');
const ServerError = require('../utils/ServerError');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/');
  },
  filename: (req, file, cb) => {
    cb(null, `${v4()}.${file.mimetype.split('/')[1]}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (/^image/.test(file.mimetype)) cb(null, true);
  else cb(null, false);
};

/**
 * check if the image passed the fileFilter Validation, if pass insert the image path into req.body.image
 */
const imgInserted = (req, res, next) => {
  // throw new ServerError('Attached file is not an image', 422);
  if (req.file) req.body.image = `img/${req.file.filename}`;
  next();
};

module.exports = [multer({ storage, fileFilter }).single('image'), imgInserted];
