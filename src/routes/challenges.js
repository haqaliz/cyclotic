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
  challengesController.getChallengesList,
);

module.exports = router;
