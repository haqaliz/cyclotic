const express = require('express');
const router = express.Router();

router.use('/insights', require('./insights'));
router.use('/activities', require('./activities'));

module.exports = router;