const expressValidator = require('express-validator');

const { param, body, query } = expressValidator;

const createInsight = [
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

const updateInsight = [
  param('insight_id')
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

const deleteInsight = [
  param('insight_id')
    .trim()
    .notEmpty(),
];

const getInsights = [
  query('type')
    .optional()
    .trim()
    .notEmpty(),
];

module.exports = {
  createInsight,
  updateInsight,
  deleteInsight,
  getInsights,
};
