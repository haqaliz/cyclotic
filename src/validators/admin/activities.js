const expressValidator = require('express-validator');

const { param, body, query } = expressValidator;

const createActivity = [
  body('type')
    .optional()
    .trim()
    .notEmpty(),
  body('name')
    .optional()
    .trim()
    .notEmpty(),
  body('category')
    .optional()
    .trim()
    .notEmpty(),
  body('content')
    .optional()
    .isArray(),
];

const updateActivity = [
  param('activity_id')
    .trim()
    .notEmpty(),
  body('type')
    .optional()
    .trim()
    .notEmpty(),
  body('name')
    .optional()
    .trim()
    .notEmpty(),
  body('category')
    .optional()
    .trim()
    .notEmpty(),
  body('content')
    .optional()
    .isArray(),
];

const deleteActivity = [
  param('activity_id')
    .trim()
    .notEmpty(),
];

const getActivities = [
  query('type')
    .optional()
    .trim()
    .notEmpty(),
];

module.exports = {
  createActivity,
  updateActivity,
  deleteActivity,
  getActivities,
};
