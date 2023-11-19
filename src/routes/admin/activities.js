const express = require('express');
const controllers = require('../../controllers');
const validators = require('../../validators');

const controller = controllers.admin.activities;
const validator = validators.admin.activities;
const { utils } = validators;

const router = express.Router();

// create activity for a admin user
router.post(
  '/',
  utils.isPrivilegedForAdmin,
  validator.createActivity,
  utils.validate,
  controller.createActivity,
);

// update a activity for a admin user
router.put(
  '/:activity_id',
  utils.isPrivilegedForAdmin,
  validator.updateActivity,
  utils.validate,
  controller.updateActivity,
);

// delete a activity for a admin user
router.delete(
  '/:activity_id',
  utils.isPrivilegedForAdmin,
  validator.deleteActivity,
  utils.validate,
  controller.deleteActivity,
);

// create a activity for a admin user
router.get(
  '/',
  utils.isPrivilegedForAdmin,
  validator.getActivities,
  utils.validate,
  controller.getActivities,
);

module.exports = router;
