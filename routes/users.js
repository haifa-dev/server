const router = require('express').Router();
const User = require('../models/User');
const { users } = require('../controllers');
const auth = require('../middleware/auth');
const bodyValidation = require('../middleware/bodyValidation');

const { userLogin, createUser, getUser, deleteUser } = users;

router
  .route('/')
  .get(auth, getUser)
  .post(bodyValidation(User, 'create'), createUser)
  .delete(auth, deleteUser);

router.post('/login', bodyValidation(User, 'login'), userLogin);

module.exports = router;
