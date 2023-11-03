const express = require('express');
const controllers = require('../controllers');
const validators = require('../validators');

const challengesController = controllers.challenges;
const challengesValidator = validators.challenges;
const { utils } = validators;

const router = express.Router();

router.use(utils.isPrivileged);

// getting all challenges
router.get(
  '/list',
  challengesValidator.getChallengesList,
  utils.validate,
  challengesController.getChallengesList,
);

// getting accepted challenges
router.get(
  '/',
  challengesController.getAcceptedChallenges,
);

// getting challenge
router.get(
  '/:challenge_id',
  challengesValidator.getChallenge,
  utils.validate,
  challengesController.getChallenge,
);

// accept challenge
router.post(
  '/:challenge_id',
  challengesValidator.acceptChallenge,
  utils.validate,
  challengesController.acceptChallenge,
);

// accept challenge
router.delete(
  '/:challenge_id',
  challengesValidator.rejectChallenge,
  utils.validate,
  challengesController.rejectChallenge,
);

module.exports = router;
