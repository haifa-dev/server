const crypto = require('crypto');
const { Op } = require('sequelize');
const _ = require('lodash');
const express = require('express');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    // validate request body object
    const { error } = User.validateAll(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) throw new AppError('Invalid credentials', 400);

    const validPassword = await user.comparePassword(req.body.password);
    if (!validPassword) throw new AppError('Invalid credentials', 400);
    const token = user.generateAuthToken();
    res.send({ token });
  } catch (ex) {
    next(ex);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    // validate request body object
    const { error } = User.validateAll(req.body);
    if (error) throw new AppError(error.details[0].message, 400);
    // validate email unique
    let user = await User.findOne({ where: { email: req.body.email } });
    if (user) throw new AppError('User already registered', 400);
    // create new user
    user = await User.create(_.pick(req.body, ['email', 'password', 'name']));
    // generate authentication token
    const token = user.generateAuthToken();

    res
      .header('Authorization', token)
      .status(201)
      .send(_.pick(user, ['id', 'name', 'email']));
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res) => res.send(req.user));

router.post('/forgotPassword', async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = await user.generateResetToken();

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.update({ resetToken: null, resetTokenExpires: null });
    return next(new AppError('There was an error sending the email. Try again later!'), 500);
  }
});

router.patch('/resetPassword/:token', async (req, res, next) => {
  try {
    // get user  based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      where: { resetToken: hashedToken, resetTokenExpires: { [Op.gt]: Date.now() } }
    });
    // if token has not expired and there is a user set there new password
    if (!user) throw new AppError('Token is invalid', 400);
    await user.update({ password: req.body.password, resetToken: null, resetTokenExpires: null });
    // update changedPasswordAt property for the user
    res.send({ status: 'success', token: user.generateAuthToken() });
  } catch (ex) {
    next(ex);
  }
});

router.patch('/changePassword', auth, async (req, res, next) => {
  try {
    // get user from the collection
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'password'] });

    // check if posted password is current
    // if (!(await user.comparePassword(req.body.password))) throw new AppError('Invalid password', 401);
    if (!(await user.comparePassword(req.body.currentPassword)))
      return new AppError('Invalid password.', 401);
    // if so update password
    await user.update({ password: req.body.password });
    // await user.update({ password: req.body.password });
    const token = user.generateAuthToken();
    res.header('Authorization', token).send(_.pick(await user.reload(), ['id', 'name', 'email']));
  } catch (error) {
    next(error);
  }
});

router.patch('/updateUser', auth, async (req, res) => {
  const { email, name } = req.body;
  const user = await User.findByPk(req.user.id);
  const properties = {};

  if (name) properties.name = name;
  if (email) properties.email = email;

  await user.update(properties);
  res.send(user);
});

router.delete('/', async (req, res) => {
  // find a single user with the id
  const user = await User.findByPk(req.user.id);
  // validate dev profiles existence in the database
  if (!user) throw new AppError('The user with the given ID was not found.', 404);

  // delete the current user
  await user.destroy();
  // send status if successes
  res.sendStatus(204);
});

module.exports = router;
// user = new User(_.pick(req.body, ['name', 'email', 'password']));
