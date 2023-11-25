const express = require('express');
const router = express.Router();

router.use('/insights', require('./insights'));
router.use('/activities', require('./activities'));
router.use('/recommendations', require('./recommendations'));

module.exports = router;