const expressValidator = require('express-validator');

const { body, query } = expressValidator;

const sanitizeUnixEpoch = (v) => {
  return new Date(parseFloat(v, 10) * 1000);
};

const contact = [
  body('name')
    .trim()
    .notEmpty(),
  body('email')
    .trim()
    .notEmpty()
    .isEmail(),
  body('subject')
    .trim()
    .notEmpty(),
  body('message')
    .trim()
    .notEmpty(),
];

const explore = [
  query('from')
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .customSanitizer(sanitizeUnixEpoch),
  query('to')
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .customSanitizer(sanitizeUnixEpoch),
  query('limit')
    .optional()
    .trim()
    .notEmpty()
    .isNumeric(),
  query('query')
    .optional()
    .trim()
    .notEmpty(),
  query('start_after')
    .optional()
    .trim()
    .notEmpty(),
];

const trends = [
  query('from')
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .customSanitizer(sanitizeUnixEpoch),
  query('to')
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .customSanitizer(sanitizeUnixEpoch),
  query('limit')
    .optional()
    .trim()
    .notEmpty()
    .isNumeric(),
];

module.exports = {
  contact,
  explore,
  trends,
};
