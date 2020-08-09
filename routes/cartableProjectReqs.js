const router = require('express').Router();
const bodyValidation = require('../middleware/bodyValidation');
const CartableProjectReq = require('../db/models/CartableProjectReq');
const queryHandler = require('../middleware/queryHandler');

router.post('/', bodyValidation(CartableProjectReq, 'create'), async (req, res) => {
  const projectReq = await CartableProjectReq.create(req.body);

  res.status(201).send({
    status: 'Success',
    data: projectReq
  });
});

router.route('/').get(queryHandler(CartableProjectReq), async (req, res) => {
  const charitableProjectReq = await CartableProjectReq.findAll(req.queryParams);

  res.send({
    status: 'Success',
    results: charitableProjectReq.length,
    charitableProjectReq
  });
});
module.exports = router;
