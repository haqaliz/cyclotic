const express = require('express');
const controllers = require('../../controllers');
const validators = require('../../validators');

const controller = controllers.admin.recommendations;
const validator = validators.admin.recommendations;
const { utils } = validators;

const router = express.Router();

// create activity for a admin user
router.post(
  '/',
  utils.isPrivilegedForAdmin,
  validator.createRecommendation,
  utils.validate,
  controller.createRecommendation,
);

// update a activity for a admin user
router.put(
  '/:recommendation_id',
  utils.isPrivilegedForAdmin,
  validator.updateRecommendation,
  utils.validate,
  controller.updateRecommendation,
);

// delete a activity for a admin user
router.delete(
  '/:recommendation_id',
  utils.isPrivilegedForAdmin,
  validator.deleteRecommendation,
  utils.validate,
  controller.deleteRecommendation,
);

// create a activity for a admin user
router.get(
  '/',
  utils.isPrivilegedForAdmin,
  validator.getRecommendations,
  utils.validate,
  controller.getRecommendations,
);

module.exports = router;
