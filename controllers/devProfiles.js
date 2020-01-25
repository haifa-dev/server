const _ = require('lodash');
const DevProfile = require('../models/DevProfile');
const AppError = require('../utils/AppError');
const { removeImg } = require('../utils/fsManipulations');

/**
 * get all the DevProfiles from the database
 * can pass pagination options offset, limit
 * via req.query
 */
exports.getDevProfiles = async (req, res) => {
  const { offset, limit } = req.query;
  let devProfiles;

  // checking for pagination query options
  if (offset && limit)
    devProfiles = await DevProfile.findAndCountAll({
      offset,
      limit,
      raw: true
    });
  else if (offset)
    devProfiles = await DevProfile.findAndCountAll({ offset, raw: true });
  else if (limit)
    devProfiles = await DevProfile.findAndCountAll({ limit, raw: true });
  else devProfiles = await DevProfile.findAndCountAll({ raw: true });

  res.send(devProfiles);
};

/**
 * get a developer profile by the primary key via the req.params.id
 */
exports.getDevProfileByPK = async (req, res) => {
  // check if uuid isValid
  const { error } = DevProfile.isUUID(req.params.id);
  if (error) throw new AppError(error.details[0].message, 400);

  const devProfile = await DevProfile.findByPk(req.params.id, { raw: true });
  // validate dev profiles existence in the database
  if (!devProfile) {
    throw new AppError(
      'The developer profile with the given ID was not found.',
      404
    );
  }
  res.send(devProfile);
};

/**
 * remove a developer profile if exists
 */
exports.deleteDevProfileByPK = async (req, res) => {
  // check if uuid isValid
  const { error } = DevProfile.isUUID(req.params.id);
  if (error) throw new AppError(error.details[0].message, 400);
  // find a single user with the id
  const devProfile = await DevProfile.findByPk(req.params.id);
  // validate dev profiles existence in the database
  if (!devProfile) {
    throw new AppError(
      'The developer profile with the given ID was not found.',
      404
    );
  }
  // delete the current developer profile
  removeImg(devProfile.image);
  await devProfile.destroy();
  // send status if successes
  res.sendStatus(204);
};

/**
 * Create new Developer profile if valid
 */
exports.createDevProfile = async (req, res) => {
  // user image type validation via multer
  if (!req.file) throw new AppError('Attached file is not an image', 422);
  req.body.image = req.file.path;
  //  user input validation
  const { error } = await DevProfile.validateAll(req.body);
  if (error) {
    removeImg(req.file.path);
    throw new AppError(error.details[0].message, 400);
  }
  // validate from developer profile replicates
  let devProfile = await DevProfile.findOne({
    where: { email: req.body.email }
  });
  if (devProfile) {
    removeImg(req.file.path);
    throw new AppError('The Developer profile already exists.', 400);
  }
  devProfile = await DevProfile.create(
    _.pick(req.body, ['email', 'name', 'image', 'bio'])
  );
  res.status(201).send(devProfile);
};

exports.updateDevProfile = async (req, res) => {
  // check if uuid isValid
  const { error: uuidError } = DevProfile.isUUID(req.params.id);
  if (uuidError) {
    removeImg(req.file.path);
    throw new AppError(uuidError.details[0].message, 400);
  }
  // user image type validation via multer
  if (!req.file) throw new AppError('Attached file is not an image', 422);
  req.body.image = req.file.path;
  //  user input validation
  const { error } = await DevProfile.validateAll(req.body);
  if (error) {
    removeImg(req.file.path);
    throw new AppError(error.details[0].message, 400);
  }
  const devProfile = await DevProfile.findByPk(req.params.id);
  // check if the profile exists
  if (!devProfile) {
    removeImg(req.file.path);
    throw new AppError(
      'The developer profile with the given ID was not found.',
      404
    );
  }
  // remove the old image
  removeImg(devProfile.image);
  await devProfile.update(_.pick(req.body, ['email', 'name', 'image', 'bio']));

  res.send(devProfile);
};

// Object.keys(exports).forEach(key => (exports[key] = asyncHandler(exports[key])));
