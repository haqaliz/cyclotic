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

module.exports = router;
