const expressValidator = require('express-validator');

const { body } = expressValidator;

const login = [
  body('email')
    .trim()
    .notEmpty()
    .isEmail(),
  body('password').notEmpty(),
];

const signup = [
  body('email')
    .trim()
    .notEmpty()
    .isEmail(),
  body('password').notEmpty(),
];

module.exports = {
  login,
  signup,
};
