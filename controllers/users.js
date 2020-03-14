const crypto = require('crypto');
const { Op } = require('sequelize');
const _ = require('lodash');
const User = require('../models/User');
const { mailPasswordRestToken } = require('../services/Mail');

const ServerError = require('../utils/ServerError');

exports.getUser = async (req, res, next) => {
  const user = await User.findByPk(req.user.id, { attributes: ['id', 'email', 'name'] });

  if (!user) throw new ServerError('The user with the given ID was not found.', 404);

  res.status(200).send({
    status: 'Success',
    data: user
  });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (!user) throw new ServerError('The user with the given ID was not found.', 404);

  await user.destroy();
  res.status(204).json({
    status: 'Success',
    data: null
  });
};

exports.createUser = async (req, res) => {
  let user = await User.findOne({ where: { email: req.body.email } });
  if (user) throw new ServerError('User already registered', 400);

  user = await User.create(_.pick(req.body, ['email', 'password', 'role', 'name']));

  const token = user.generateAuthToken();

  res
    .header('Authorization', token)
    .status(201)
    .send({
      status: 'Success',
      token,
      data: _.pick(user, ['id', 'name', 'email'])
    });
};

exports.updateUser = async (req, res) => {
  const { email, name } = req.body;
  const user = await User.findByPk(req.user.id);
  const properties = {};

  if (name) properties.name = name;
  if (email) properties.email = email;

  await user.update(properties);
  res.send({
    status: 'Success',
    data: _.pick(user, ['id', 'name', 'email'])
  });
};

exports.login = async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) throw new ServerError('Invalid credentials', 400);

  const validPassword = await user.comparePassword(req.body.password);
  if (!validPassword) throw new ServerError('Invalid credentials', 400);
  const token = user.generateAuthToken();

  res.header('Authorization', token).send({
    status: 'Success',
    token,
    data: _.pick(user, ['id', 'name', 'email'])
  });
};

exports.updatePassword = async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  if (!(await user.comparePassword(req.body.currentPassword)))
    throw new ServerError('Invalid password.', 401);

  await user.update({ password: req.body.password });

  const token = user.generateAuthToken();
  res.header('Authorization', token).send({
    status: 'Success',
    token,
    data: _.pick(user, ['id', 'name', 'email'])
  });
};

exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(new ServerError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = await user.generateResetToken();

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;

  try {
    await mailPasswordRestToken(user, resetURL);

    res.status(200).json({
      status: 'Success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    await user.update({ resetToken: null, resetTokenExpires: null });
    next(new ServerError('Mail service is down, try again later.'), 500);
  }
};

exports.resetPassword = async (req, res, next) => {
  // get user  based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    where: { resetToken: hashedToken, resetTokenExpires: { [Op.gt]: Date.now() } }
  });
  // if token has not expired and there is a user set there new password
  if (!user) throw new ServerError('Token is invalid', 400);
  await user.update({ password: req.body.password, resetToken: null, resetTokenExpires: null });
  const token = user.generateAuthToken();
  // update changedPasswordAt property for the user
  res.header('Authorization', token).send({
    status: 'Success',
    token,
    data: _.pick(user, ['id', 'name', 'email'])
  });
};
