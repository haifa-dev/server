const router = require('express').Router();
const users = require('./users');
const charitableProjectReqs = require('./charitableProjectReqs');
const profitableProjectReqs = require('./profitableProjectReqs');

router.use('/users', users);
router.use('/charitableProjectReqs', charitableProjectReqs);
router.use('/profitableProjectReqs', profitableProjectReqs);

module.exports = router;
