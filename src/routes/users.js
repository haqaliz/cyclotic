const express = require('express');
const controllers = require('../controllers');
const validators = require('../validators');

const usersController = controllers.users;
const usersValidator = validators.users;
const { utils } = validators;

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
  usersValidator.getRecordedDayForUser,
  utils.validate,
  usersController.getRecordedDaysForUser,
);

// getting latest start of menstrual cycle recording day for a user
router.get(
  '/:id/recorded-days/latest/start',
  usersController.getLatestMenstrualCycleStartForUser,
);

module.exports = router;
