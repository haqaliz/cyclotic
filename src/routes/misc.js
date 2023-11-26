const express = require('express');
const controllers = require('../controllers');
const validators = require('../validators');

const miscController = controllers.misc;
const miscValidator = validators.misc;
const { utils } = validators;

const router = express.Router();

router.post(
  '/contact',
  miscValidator.contact,
  utils.validate,
  miscController.contact,
);

router.get(
  '/explore',
  miscValidator.explore,
  utils.validate,
  miscController.explore,
);

router.get(
  '/trends',
  miscValidator.trends,
  utils.validate,
  miscController.trends,
);

router.get(
  '/brands',
  utils.isPrivileged,
  miscController.brands,
)

module.exports = router;
