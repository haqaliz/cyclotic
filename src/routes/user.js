const express = require('express');
const controllers = require('../controllers');
const validators = require('../validators');

const userController = controllers.user;
const userValidator = validators.user;
const { utils } = validators;

const router = express.Router();

// logged-in user information
router.get(
  '/token',
  userController.getToken,
);

// logged-in user information
router.get(
  '/info',
  utils.isPrivileged,
  userController.info,
);

// logged-in user information
router.get(
  '/:user_id/info',
  userValidator.getInfo,
  utils.validate,
  userController.getUserPublicInfo,
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
  utils.isPrivileged,
  userValidator.addRecordedDayForUser,
  utils.validate,
  userController.addRecordedDayForUser,
);

// updating recorded day for a user
router.put(
  '/recorded-day/:recorded_day_id',
  utils.isPrivileged,
  userValidator.updateRecordedDayForUser,
  utils.validate,
  userController.updateRecordedDayForUser,
);

// deleting a recorded day for a user
router.delete(
  '/recorded-day/:recorded_day_id',
  utils.isPrivileged,
  userValidator.deleteRecordedDayForUser,
  utils.validate,
  userController.deleteRecordedDayForUser,
);

// getting recording days for a user
router.get(
  '/recorded-days',
  utils.isPrivileged,
  userValidator.getRecordedDayForUser,
  utils.validate,
  userController.getRecordedDaysForUser,
);

// getting latest start of menstrual cycle recording day for a user
router.get(
  '/recorded-days/menstrual-cycles/latest/start',
  utils.isPrivileged,
  userController.getLatestMenstrualCycleStartForUser,
);

// getting all start of menstrual cycles between two dates for a user
router.get(
  '/recorded-days/menstrual-cycles',
  utils.isPrivileged,
  userValidator.getMenstrualCyclesForUser,
  utils.validate,
  userController.getMenstrualCyclesForUser,
);

// subscribe to a plan for a user
router.post(
  '/subscribe',
  utils.isPrivileged,
  userValidator.subscribeForPlan,
  utils.validate,
  userController.subscribeForPlan,
);

// getting all ads for a user
router.get(
  '/recommendations',
  utils.isPrivileged,
  userController.getRecommendationsForUser,
);

// create a post for a user
router.post(
  '/posts',
  utils.isPrivileged,
  userValidator.createPost,
  utils.validate,
  userController.createPost,
);

// get posts for a user
router.get(
  '/posts',
  utils.isPrivileged,
  userValidator.getPosts,
  utils.validate,
  userController.getPosts,
);

// delete a post for a user
router.delete(
  '/posts/:post_id',
  utils.isPrivileged,
  userValidator.deletePost,
  utils.validate,
  userController.deletePost,
);

// get a post for a user
router.get(
  '/posts/:post_id',
  userValidator.getPost,
  utils.validate,
  userController.getPost,
);

// like a post for a user
router.post(
  '/posts/:post_id/like',
  utils.isPrivileged,
  userValidator.likePost,
  utils.validate,
  userController.likePost,
);

// update a challenge for a user
router.put(
  '/challenges/:challenge_id',
  utils.isPrivileged,
  userValidator.updateUserChallenge,
  utils.validate,
  userController.updateUserChallenge,
);

// get challenges history for a user
router.get(
  '/challenges/history',
  utils.isPrivileged,
  userValidator.getChallengesHistory,
  utils.validate,
  userController.getChallengesHistory,
);

// get user notifications
router.get(
  '/notifications',
  utils.isPrivileged,
  userValidator.getNotifications,
  utils.validate,
  userController.getNotifications,
);

// create insights for a admin user
router.post(
  '/insights',
  utils.isPrivilegedForAdmin,
  userValidator.createInsight,
  utils.validate,
  userController.createInsight,
);

// update a insight for a admin user
router.put(
  '/insights/:insight_id',
  utils.isPrivilegedForAdmin,
  userValidator.updateInsight,
  utils.validate,
  userController.updateInsight,
);

// delete a insight for a admin user
router.delete(
  '/insights/:insight_id',
  utils.isPrivilegedForAdmin,
  userValidator.deleteInsight,
  utils.validate,
  userController.deleteInsight,
);

// create a insight for a admin user
router.get(
  '/insights',
  utils.isPrivilegedForAdmin,
  userValidator.getInsights,
  utils.validate,
  userController.getInsights,
);

module.exports = router;
