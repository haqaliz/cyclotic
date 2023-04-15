import { body } from 'express-validator';

export const login = [
  body('email')
    .trim()
    .notEmpty()
    .isEmail(),
  body('password').notEmpty(),
];

export const signup = [
  body('email')
    .trim()
    .notEmpty()
    .isEmail(),
  body('password').notEmpty(),
];

export default {
  login,
  signup,
};
