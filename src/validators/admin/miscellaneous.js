const expressValidator = require('express-validator');

const { param, body, query } = expressValidator;

const createMiscellaneous = [
  body('key')
    .optional()
    .trim()
    .notEmpty(),
  body('value')
    .optional()
    .trim()
    .notEmpty(),
  body('metadata')
    .optional(),
];

const updateMiscellaneous = [
  param('miscellaneous_id')
    .trim()
    .notEmpty(),
  body('key')
    .optional()
    .trim()
    .notEmpty(),
  body('value')
    .optional()
    .trim()
    .notEmpty(),
  body('metadata')
    .optional(),
];

const deleteMiscellaneous = [
  param('miscellaneous_id')
    .trim()
    .notEmpty(),
];

const getMiscellaneousList = [
  query('key')
    .optional()
    .trim()
    .notEmpty(),
];

module.exports = {
  createMiscellaneous,
  updateMiscellaneous,
  deleteMiscellaneous,
  getMiscellaneousList,
};
