const expressValidator = require('express-validator');

const { param, body, query } = expressValidator;

const sanitizeBoolean = (v) => {
    return /(t|yes|y|true|1)/i.test(v.toLowerCase());
};

const getChallengesList = [
  query('update')
    .optional()
      .customSanitizer(sanitizeBoolean)
      .isBoolean(),
];

const getChallenge = [
  param('challenge_id')
    .trim()
    .notEmpty(),
];

const acceptChallenge = [
  param('challenge_id')
    .trim()
    .notEmpty(),
];

const rejectChallenge = [
  param('challenge_id')
    .trim()
    .notEmpty(),
];

module.exports = {
  getChallengesList,
  getChallenge,
  acceptChallenge,
  rejectChallenge,
};
