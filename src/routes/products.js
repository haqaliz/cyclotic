const express = require('express');
const controllers = require('../controllers');
const validators = require('../validators');

const productsController = controllers.products;
const productsValidator = validators.products;
const { utils } = validators;

const router = express.Router();

router.use(utils.isPrivileged);

// getting all products
router.get(
  '/list',
  productsController.getProductsList,
);

module.exports = router;
