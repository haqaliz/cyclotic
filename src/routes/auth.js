import express from 'express';
import { auth as authController } from '../controllers/index.js';
import { auth as authValidator, utils } from '../validators/index.js';

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

export default router;
