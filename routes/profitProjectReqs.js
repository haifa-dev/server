const router = require('express').Router();
const bodyValidation = require('../middleware/bodyValidation');
const ProfitProjectReq = require('../db/models/ProfitProjectReq');

router.post('/', bodyValidation(ProfitProjectReq, 'create'), async (req, res) => {
  const profitProjectReq = await ProfitProjectReq.create(req.body);

  res.status(201).send({
    status: 'Success',
    data: profitProjectReq
  });
});

module.exports = router;
