const expressValidator = require('express-validator');

const { param, body, query } = expressValidator;

const createRecommendation = [
  body('type')
    .optional()
    .trim()
    .notEmpty(),
  body('brand')
    .optional()
    .trim()
    .notEmpty(),
  body('name')
    .optional()
    .trim()
    .notEmpty(),
  body('url')
    .optional()
    .trim()
    .notEmpty(),
  body('img')
    .optional()
    .trim()
    .notEmpty(),
  body('price')
    .optional(),
  body('features')
    .optional()
    .isArray(),
];

const updateRecommendation = [
  param('recommendation_id')
    .trim()
    .notEmpty(),
  body('type')
    .optional()
    .trim()
    .notEmpty(),
  body('brand')
    .optional()
    .trim()
    .notEmpty(),
  body('name')
    .optional()
    .trim()
    .notEmpty(),
  body('url')
    .optional()
    .trim()
    .notEmpty(),
  body('img')
    .optional()
    .trim()
    .notEmpty(),
  body('price')
    .optional(),
  body('features')
    .optional()
    .isArray(),
];

const deleteRecommendation = [
  param('recommendation_id')
    .trim()
    .notEmpty(),
];

const getRecommendations = [
  query('type')
    .optional()
    .trim()
    .notEmpty(),
];

module.exports = {
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
  getRecommendations,
};
