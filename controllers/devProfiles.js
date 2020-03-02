const DevProfile = require('../models/DevProfile');
const AppError = require('../utils/AppError');
const { removeImg } = require('../utils/fileSystem');
const Social = require('../models/Link');

/**
 * get all the developer profiles can pass
 * pagination options offset and limit via query.
 */
exports.getDevProfiles = async (req, res) => {
  const { offset, limit } = req.query;
  const projectParams = { subQuery: true, include: 'socials' };

  // checking for pagination query options
  if (offset) projectParams.offset = offset;
  if (limit) projectParams.limit = limit;

  const devProfiles = await DevProfile.findAll(projectParams);

  res.send(devProfiles);
};

/**
 * get developer profile by passing the primary key via the param id.
 */
exports.getDevProfile = async (req, res) => {
  const devProfile = await DevProfile.findByPk(req.params.id, {
    include: 'socials'
  });
  // validate if developer profile exists
  if (!devProfile) {
    throw new AppError('The developer profile with the given ID was not found.', 404);
  }
  res.send(devProfile);
};

/**
 * delete developer profile by passing the primary key via the param id.
 */
exports.deleteDevProfile = async (req, res) => {
  // find a single user with the id
  const devProfile = await DevProfile.findByPk(req.params.id);
  // validate dev profiles existence in the database
  if (!devProfile)
    throw new AppError('The developer profile with the given ID was not found.', 404);

  // delete the current developer profile
  await removeImg(devProfile.image);
  await devProfile.destroy();
  // send status if successes
  res.sendStatus(204);
};

/**
 * middleware validation with devProfile schema for req.body
 */
exports.validateDevProfile = (req, res, next) => {
  //  user input validation
  const { error } = DevProfile.validateAll(req.body);
  if (error) throw new AppError(error.details[0].message, 400);

  next();
};

/**
 * create new developer profile with social tags via request body
 */
exports.createDevProfile = async (req, res) => {
  // validate from developer profile replicates
  let devProfile = await DevProfile.findOne({
    where: { email: req.body.email }
  });

  if (devProfile) throw new AppError('The Developer profile already exists.', 400);

  devProfile = await DevProfile.create(req.body, {
    include: { all: true }
  });

  res.status(201).send(devProfile);
};

/**
 * find developer profile with primary key via param id and update via request body
 */
exports.updateDevProfile = async (req, res) => {
  const devProfile = await DevProfile.findByPk(req.params.id, { include: { all: true } });
  // check if the profile exists
  if (!devProfile)
    throw new AppError('The developer profile with the given ID was not found.', 404);
  // remove old image
  await removeImg(devProfile.image);
  // recreate the social tags
  await Social.destroy({ where: { devProfileId: req.params.id } });

  if (req.body.socials) {
    req.body.socials.forEach(social => {
      social.devProfileId = req.params.id;
    });
    await Social.bulkCreate(req.body.socials);
  }
  // save devProfile changes
  await devProfile.update(req.body);
  // refresh and get the updated version of the instance
  await devProfile.reload({ include: { all: true } });

  res.send(devProfile);
};
