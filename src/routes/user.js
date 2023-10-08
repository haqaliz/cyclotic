const express = require('express');
const controllers = require('../controllers');
const validators = require('../validators');

const userController = controllers.user;
const userValidator = validators.user;
const { utils } = validators;

const router = express.Router();

router.use(utils.isPrivileged);

// logged-in user information
router.get(
  '/info',
  utils.isPrivileged,
  userController.info,
);

// update logged-in user information
router.put(
  '/info',
  utils.isPrivileged,
  userValidator.updateInfo,
  utils.validate,
  userController.updateInfo,
);

// adding recorded day for a user
router.post(
  '/recorded-day',
  userValidator.addRecordedDayForUser,
  utils.validate,
  userController.addRecordedDayForUser,
);

// updating recorded day for a user
router.put(
  '/recorded-day/:recorded_day_id',
  userValidator.updateRecordedDayForUser,
  utils.validate,
  userController.updateRecordedDayForUser,
);

// deleting a recorded day for a user
router.delete(
  '/recorded-day/:recorded_day_id',
  userValidator.deleteRecordedDayForUser,
  utils.validate,
  userController.deleteRecordedDayForUser,
);

// getting recording days for a user
router.get(
  '/recorded-days',
  userValidator.getRecordedDayForUser,
  utils.validate,
  userController.getRecordedDaysForUser,
);

// getting latest start of menstrual cycle recording day for a user
router.get(
  '/recorded-days/menstrual-cycles/latest/start',
  userController.getLatestMenstrualCycleStartForUser,
);

// getting all start of menstrual cycles between two dates for a user
router.get(
  '/recorded-days/menstrual-cycles',
  userValidator.getMenstrualCyclesForUser,
  utils.validate,
  userController.getMenstrualCyclesForUser,
);

// subscribe to a plan for a user
router.post(
  '/subscribe',
  userValidator.subscribeForPlan,
  utils.validate,
  userController.subscribeForPlan,
);

module.exports = router;
