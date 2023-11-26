const express = require('express');
const controllers = require('../../controllers');
const validators = require('../../validators');

const controller = controllers.admin.miscellaneous;
const validator = validators.admin.miscellaneous;
const { utils } = validators;

const router = express.Router();

// create activity for a admin user
router.post(
  '/',
  utils.isPrivilegedForAdmin,
  validator.createMiscellaneous,
  utils.validate,
  controller.createMiscellaneous,
);

// update a activity for a admin user
router.put(
  '/:miscellaneous_id',
  utils.isPrivilegedForAdmin,
  validator.updateMiscellaneous,
  utils.validate,
  controller.updateMiscellaneous,
);

// delete a activity for a admin user
router.delete(
  '/:miscellaneous_id',
  utils.isPrivilegedForAdmin,
  validator.deleteMiscellaneous,
  utils.validate,
  controller.deleteMiscellaneous,
);

// create a activity for a admin user
router.get(
  '/',
  utils.isPrivilegedForAdmin,
  validator.getMiscellaneousList,
  utils.validate,
  controller.getMiscellaneousList,
);

module.exports = router;
