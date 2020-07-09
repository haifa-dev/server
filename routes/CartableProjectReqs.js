const router = require('express').Router();
const { bodyValidation } = require('../middleware/bodyValidation');
const CartableProjectReq = require('../db/models/CartableProjectReq');

router.post('/', bodyValidation(CartableProjectReq), async (req, res) => {
  res.send('work');
});

module.exports = router;
