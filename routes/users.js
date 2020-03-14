const router = require('express').Router();
const User = require('../db/User');
const auth = require('../middleware/auth');
const bodyValidation = require('../middleware/bodyValidation');
const { users } = require('../controllers');

const {
  login,
  createUser,
  getUser,
  deleteUser,
  updateUser,
  updatePassword,
  forgotPassword,
  resetPassword
} = users;

router
  .route('/')
  .get(auth, getUser)
  .post(bodyValidation(User), createUser)
  .delete(auth, deleteUser)
  .patch(auth, bodyValidation(User, false), updateUser);

router.patch('/updatePassword', auth, bodyValidation(User, false), updatePassword);

router.post('/login', bodyValidation(User), login);

router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', bodyValidation(User, false), resetPassword);

module.exports = router;
