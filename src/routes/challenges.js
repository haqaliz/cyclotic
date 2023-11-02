const express = require('express');
const controllers = require('../controllers');
const validators = require('../validators');

const challengesController = controllers.challenges;
const challengesValidator = validators.challenges;
const { utils } = validators;

const router = express.Router();

// router.use(utils.isPrivileged);

// getting all challenges
router.get(
  '/list',
  challengesValidator.getChallengesList,
  utils.validate,
  challengesController.getChallengesList,
);

// getting all challenges
router.get(
  '/:challenge_id',
  challengesValidator.getChallenge,
  utils.validate,
  challengesController.getChallenge,
);

module.exports = router;
