const router = require('express').Router();
const users = require('./users');
const charitableProjectReqs = require('./charitableProjectReqs');

router.use('/users', users);
router.use('/charitableProjectReqs', charitableProjectReqs);

module.exports = router;
