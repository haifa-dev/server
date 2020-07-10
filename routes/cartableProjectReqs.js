const router = require('express').Router();
const bodyValidation = require('../middleware/bodyValidation');
const CartableProjectReq = require('../db/models/CartableProjectReq');

router.post('/', bodyValidation(CartableProjectReq, 'create'), async (req, res) => {
  const projectReq = await CartableProjectReq.create(req.body);

  res.status(201).send({
    status: 'Success',
    data: projectReq
  });
});

module.exports = router;
