import express from 'express';
import { users as usersController } from '../controllers/index.js';
import { users as usersValidator, utils } from '../validators/index.js';

const router = express.Router();

router.post(
  '/:id/recorded-day',
  usersValidator.addRecordedDayForUser,
  utils.validate,
  usersController.addRecordedDayForUser,
);
router.get(
  '/:id/recorded-days',
  usersController.getRecordedDaysForUser,
);

export default router;
