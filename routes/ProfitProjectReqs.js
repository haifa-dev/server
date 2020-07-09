const router = require('express').Router();
const { bodyValidation } = require('../middleware/bodyValidation');
const ProfitProjectReq = require('../db/models/ProfitProjectReq');

router.post('/', bodyValidation(ProfitProjectReq, 'create'), async (req, res) => {
  res.send('work');
});

module.exports = router;
