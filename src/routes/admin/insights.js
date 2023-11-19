const express = require('express');
const controllers = require('../../controllers');
const validators = require('../../validators');

const controller = controllers.admin.insights;
const validator = validators.admin.insights;
const { utils } = validators;

const router = express.Router();

// create insights for a admin user
router.post(
  '/',
  utils.isPrivilegedForAdmin,
  validator.createInsight,
  utils.validate,
  controller.createInsight,
);

// update a insight for a admin user
router.put(
  '/:insight_id',
  utils.isPrivilegedForAdmin,
  validator.updateInsight,
  utils.validate,
  controller.updateInsight,
);

// delete a insight for a admin user
router.delete(
  '/:insight_id',
  utils.isPrivilegedForAdmin,
  validator.deleteInsight,
  utils.validate,
  controller.deleteInsight,
);

// create a insight for a admin user
router.get(
  '/',
  utils.isPrivilegedForAdmin,
  validator.getInsights,
  utils.validate,
  controller.getInsights,
);

module.exports = router;
