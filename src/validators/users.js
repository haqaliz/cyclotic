const expressValidator = require('express-validator');
const utils = require('../utils');

const { param, body, query } = expressValidator;
const firestoreUtils = utils.firestore;
const { RECORDED_DAY } = firestoreUtils;
const INTENSITY_THRESHOLD = { DOWN: 0, UP: 10 };

const isValidFeelings = (v) => {
  if (!v?.length) throw new Error('feelings can not be empty');
  if (v.some((i) => (
    !i.value
    || !RECORDED_DAY.FEELINGS.includes(i.value)
    || !i.intensity
    || (typeof i.intensity !== 'number')
    || (
      i.intensity < INTENSITY_THRESHOLD.DOWN
      || i.intensity > INTENSITY_THRESHOLD.UP
    )
  ))) throw new Error('feelings is not valid');
  return true;
};

const isValidSymptoms = (v) => {
  if (!v?.length) throw new Error('symptoms can not be empty');
  if (v.some((i) => (
    !i.value
    || !RECORDED_DAY.SYMPTOMS.includes(i.value)
    || !i.intensity
    || (typeof i.intensity !== 'number')
    || (
      i.intensity < INTENSITY_THRESHOLD.DOWN
      || i.intensity > INTENSITY_THRESHOLD.UP
    )
  ))) throw new Error('symptoms is not valid');
  return true;
};

const isValidVaginalDischarge = (v) => {
  if (!v?.length) throw new Error('vaginal_discharge can not be empty');
  if (v.some((i) => (
    !i.value
    || !RECORDED_DAY.VAGINAL_DISCHARGE.includes(i.value)
    || !i.intensity
    || (typeof i.intensity !== 'number')
    || (
      i.intensity < INTENSITY_THRESHOLD.DOWN
      || i.intensity > INTENSITY_THRESHOLD.UP
    )
  ))) throw new Error('vaginal_discharge is not valid');
  return true;
};

const isValidMisc = (v) => {
  if (!v?.length) throw new Error('misc can not be empty');
  if (v.some((i) => {
    let intensityCheck = false;
    if (i.value !== 'travel') {
      intensityCheck = (!i.intensity
      || (typeof i.intensity !== 'number')
      || (
        i.intensity < INTENSITY_THRESHOLD.DOWN
        || i.intensity > INTENSITY_THRESHOLD.UP
      ));
    } else {
      intensityCheck = !!i.intensity;
    }
    return (
      !i.value
      || !RECORDED_DAY.MISC.includes(i.value)
      || intensityCheck
    )
  })) throw new Error('misc is not valid');
  return true;
};

const isValidBleedingAmount = (v) => {
  if (
    typeof v !== 'number'
    || v < INTENSITY_THRESHOLD.DOWN
    || v > INTENSITY_THRESHOLD.UP
  ) throw new Error('bleeding_amount is not valid');
  return true;
};

const isValidBleedingType = (v) => {
  if (
    !RECORDED_DAY.BLEEDING_TYPE.includes(v)
  ) throw new Error('bleeding_type is not valid');
  return true;
};

const isValidBloodColor = (v) => {
  if (
    !RECORDED_DAY.BLOOD_COLOR.includes(v)
  ) throw new Error('blood_color is not valid');
  return true;
};

const isValidPregnancyTest = (v) => {
  if (
    !RECORDED_DAY.PREGNANCY_TEST.includes(v)
  ) throw new Error('pregnancy_test is not valid');
  return true;
};

const isValidSexSituation = (v) => {
  if (
    !RECORDED_DAY.SEX_SITUATION.includes(v)
  ) throw new Error('sex_situation is not valid');
  return true;
};

const sanitizeUnixEpoch = (v) => {
  return new Date(parseFloat(v, 10) * 1000);
};

const addRecordedDayForUser = [
  param('id')
    .trim()
    .notEmpty(),
  body('feelings')
    .isArray()
    .custom(isValidFeelings),
  body('symptoms')
    .isArray()
    .custom(isValidSymptoms),
  body('vaginal_discharge')
    .isArray()
    .custom(isValidVaginalDischarge),
  body('misc')
    .isArray()
    .custom(isValidMisc),
  body('bleeding_amount')
    .notEmpty()
    .custom(isValidBleedingAmount),
  body('bleeding_type')
    .trim()
    .notEmpty()
    .custom(isValidBleedingType),
  body('blood_color')
    .trim()
    .notEmpty()
    .custom(isValidBloodColor),
  body('pregnancy_test')
    .trim()
    .notEmpty()
    .custom(isValidPregnancyTest),
  body('sex_situation')
    .trim()
    .notEmpty()
    .custom(isValidSexSituation),
  body('medications')
    .optional()
    .trim()
    .notEmpty()
];

const updateRecordedDayForUser = [
  param('id')
    .trim()
    .notEmpty(),
  param('recorded_day_id')
    .trim()
    .notEmpty(),
  body('feelings')
    .isArray()
    .custom(isValidFeelings),
  body('symptoms')
    .isArray()
    .custom(isValidSymptoms),
  body('vaginal_discharge')
    .isArray()
    .custom(isValidVaginalDischarge),
  body('misc')
    .isArray()
    .custom(isValidMisc),
  body('bleeding_amount')
    .notEmpty()
    .custom(isValidBleedingAmount),
  body('bleeding_type')
    .trim()
    .notEmpty()
    .custom(isValidBleedingType),
  body('blood_color')
    .trim()
    .notEmpty()
    .custom(isValidBloodColor),
  body('pregnancy_test')
    .trim()
    .notEmpty()
    .custom(isValidPregnancyTest),
  body('sex_situation')
    .trim()
    .notEmpty()
    .custom(isValidSexSituation),
  body('medications')
    .optional()
    .trim()
    .notEmpty()
];

const deleteRecordedDayForUser = [
  param('id')
    .trim()
    .notEmpty(),
  param('recorded_day_id')
    .trim()
    .notEmpty(),
];

const getRecordedDayForUser = [
  query('from')
    .trim()
    .notEmpty()
    .isNumeric()
    .customSanitizer(sanitizeUnixEpoch),
  query('to')
    .trim()
    .notEmpty()
    .isNumeric()
    .customSanitizer(sanitizeUnixEpoch),
];

module.exports = {
  addRecordedDayForUser,
  updateRecordedDayForUser,
  deleteRecordedDayForUser,
  getRecordedDayForUser,
};
