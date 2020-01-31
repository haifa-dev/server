const multer = require('multer');
const uuidv4 = require('uuid/v4');
const AppError = require('../utils/AppError');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  )
    cb(null, true);
  else cb(null, false);
};

/**
 * check if the image passed the fileFilter Validation, if pass insert the image path into req.body.image
 */
const imgInserted = (req, res, next) => {
  if (!req.file) throw new AppError('Attached file is not an image', 422);
  req.body.image = req.file.path;
  next();
};

module.exports = [multer({ storage, fileFilter }).single('image'), imgInserted];
