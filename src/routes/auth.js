const express = require('express');
const controllers = require('../controllers');
const validators = require('../validators');

const authController = controllers.auth;
const authValidator = validators.auth;
const { utils } = validators;

const router = express.Router();

router.post(
  '/signup',
  authValidator.signup,
  utils.validate,
  authController.signup,
);
router.post(
  '/login',
  authValidator.login,
  utils.validate,
  authController.login,
);
router.post(
  '/logout',
  authController.logout,
);
router.get(
  '/user',
  utils.isPrivileged,
  authController.user,
);

module.exports = router;
