const express = require('express');
const controllers = require('../controllers');
const validators = require('../validators');

const challengesController = controllers.challenges;
const challengesValidator = validators.challenges;
const { utils } = validators;

const router = express.Router();

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
  utils.isPrivileged,
  challengesController.getAcceptedChallenges,
);

// getting challenge
router.get(
  '/:challenge_id',
  utils.isPrivileged,
  challengesValidator.getChallenge,
  utils.validate,
  challengesController.getChallenge,
);

// accept challenge
router.post(
  '/:challenge_id',
  utils.isPrivileged,
  challengesValidator.acceptChallenge,
  utils.validate,
  challengesController.acceptChallenge,
);

// accept challenge
router.delete(
  '/:challenge_id',
  utils.isPrivileged,
  challengesValidator.rejectChallenge,
  utils.validate,
  challengesController.rejectChallenge,
);

module.exports = router;
