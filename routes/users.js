const router = require('express').Router();
const { User } = require('../models/User');
const { users } = require('../controllers');
const auth = require('../middleware/auth');
const bodyValidation = require('../middleware/bodyValidation');

const { userLogin, createUser, getUser, deleteUser } = users;

router
  .route('/')
  .get(auth, getUser)
  .post(bodyValidation(User, 'login'), createUser)
  .delete(auth, deleteUser);
// .patch(auth, bodyValidation(User, false), updateUser);

router.post('/login', bodyValidation(User, 'login'), userLogin);

// router.patch('/updatePassword', auth, bodyValidation(User, false), updatePassword);

// router.post('/forgotPassword', forgotPassword);

// router.patch('/resetPassword/:token', bodyValidation(User, false), resetPassword);

module.exports = router;
