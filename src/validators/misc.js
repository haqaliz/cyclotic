const expressValidator = require('express-validator');

const { body } = expressValidator;

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

module.exports = {
  contact,
};
