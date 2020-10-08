const { DevProfile, Link } = require('../db');
const ServerError = require('../utils/ServerError');

/**
 * get all developer profiles
 */
exports.getDevProfiles = async (req, res) => {
  const devProfiles = await DevProfile.findAll(req.queryParams);

  res.send({
    status: 'Success',
    results: devProfiles.length,
    data: devProfiles
  });
};

/**
 * get developer profile by id
 */
exports.getDevProfile = async (req, res) => {
  const devProfile = await DevProfile.findByPk(req.params.id);
  // validate if developer profile exists
  if (!devProfile) {
    throw new ServerError('The developer profile with the given ID was not found.', 404);
  }

  res.status(200).send({
    status: 'Success',
    data: devProfile
  });
};

/**
 * delete developer profile by id
 */
exports.deleteDevProfile = async (req, res) => {
  // find a single user with the id
  const devProfile = await DevProfile.findByPk(req.params.id);
  await Link.destroy({ where: { linkableId: req.params.id } });

  // validate dev profiles existence in the database
  if (!devProfile)
    throw new ServerError('The developer profile with the given ID was not found.', 404);

  await devProfile.destroy();
  // send status if successes
  res.status(204).send({
    status: 'Success',
    data: null
  });
};

/**
 * create new developer profile with social tags via request body
 */
exports.createDevProfile = async (req, res) => {
  // validate from developer profile replicates
  let devProfile = await DevProfile.findOne({
    where: { email: req.body.email }
  });

  if (devProfile) throw new ServerError('The Developer profile already exists.', 400);

  devProfile = await DevProfile.create(req.body, {
    include: { all: true }
  });

  res.status(201).send({
    status: 'Success',
    data: devProfile
  });
};

/**
 * find developer profile with primary key via param id and update via request body
 */
exports.updateDevProfile = async (req, res) => {
  const devProfile = await DevProfile.findByPk(req.params.id, { include: { all: true } });
  // check if the profile exists
  if (!devProfile)
    throw new ServerError('The developer profile with the given ID was not found.', 404);
  // recreate the social tags
  await Link.destroy({ where: { linkableId: req.params.id } });

  if (req.body.socials) {
    req.body.socials.forEach(social => {
      social.linkableId = req.params.id;
    });
    await Link.bulkCreate(req.body.socials);
  }
  // save devProfile changes
  await devProfile.update(req.body);
  // refresh and get the updated version of the instance
  await devProfile.reload({ include: { all: true } });

  res.send({
    status: 'Success',
    data: devProfile
  });
};
