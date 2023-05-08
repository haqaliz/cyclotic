import express from 'express';
import { users as usersController } from '../controllers/index.js';
import { users as usersValidator, utils } from '../validators/index.js';

const router = express.Router();

router.use(utils.isPrivileged);

// adding recorded day for a user
router.post(
  '/:id/recorded-day',
  usersValidator.addRecordedDayForUser,
  utils.validate,
  usersController.addRecordedDayForUser,
);

// updating recorded day for a user
router.put(
  '/:id/recorded-day/:recorded_day_id',
  usersValidator.updateRecordedDayForUser,
  utils.validate,
  usersController.updateRecordedDayForUser,
);

// deleting a recorded day for a user
router.delete(
  '/:id/recorded-day/:recorded_day_id',
  usersValidator.deleteRecordedDayForUser,
  utils.validate,
  usersController.deleteRecordedDayForUser,
);

// getting recording days for a user
router.get(
  '/:id/recorded-days',
  usersController.getRecordedDaysForUser,
);

export default router;
