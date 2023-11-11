const expressValidator = require('express-validator');
const utils = require('../utils');
const { subMonths, startOfDay } = require('date-fns');

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

const isValidRecordedDate = (v) => {
  if (Date.parse(v) === NaN) return false;
  const d = new Date(v);
  // can't submit date in future
  if (d.getTime() > Date.now()) return false;
  // can't submit date before 1 month ago
  if (d.getTime() < startOfDay(subMonths(new Date(), 1)).getTime()) return false;
  return true;
};

const isValidCard = (v) => {
  if (
    !v
    || !v?.number
    || !v?.exp_month
    || !v?.exp_year
    || !v?.cvc
  ) throw new Error('card object contains number, exp_month, exp_year and cvc');
  const cardNumber = v?.number?.toString();
  if (!(/^\d{14,}$/.test(cardNumber))) throw new Error('card number must contains 14 digits at least');
  if (v.exp_month < 1 || v.exp_month > 12) throw new Error('card exp_month must be between 1 to 12');
  const currentYear = parseInt(new Date().getFullYear().toString().substr(2), 10);
  if (v.exp_year < currentYear) throw new Error('card exp_year must be in future');
  if (!(/^\d{3,5}$/.test(v.cvc))) throw new Error('card cvc must contains 3 digits at least');
  return true;
};

const sanitizeISOString = (v) => {
  return new Date(v);
};

const sanitizeUnixEpoch = (v) => {
  return new Date(parseFloat(v, 10) * 1000);
};

const sanitizeBoolean = (v) => {
  return /(t|yes|y|true|1)/i.test(v.toLowerCase());
};

const isValidPreferences = (v) => {
  if (
    !v
    || !v?.notifications
  ) throw new Error('prefs object contains notifications object');
  if (
    !Object.keys(v ?? {}).every(
      (i) => ['notifications', 'menstruation_products'].includes(i)
    )
  ) throw new Error('prefs object can only contains notifications and menstruation_products');
  const N = v?.notifications;
  if (
    !Object.keys(N ?? {}).every(
      (i) => ['fertility_window', 'pms_symptoms', 'self_care_tips'].includes(i)
    )
  ) throw new Error('notifications object can only contains fertitlity_window, pms_symptoms and self_care');
  if (
    typeof N?.fertility_window !== 'boolean'
    && typeof N?.pms_symptoms !== 'boolean'
    && typeof N?.self_care_tips !== 'boolean'
  ) throw new Error('notifications object values must be boolean');
  if (v?.menstruation_products) {
    const MP = v?.menstruation_products;
    if (
      !Object.keys(MP ?? {}).every(
        (i) => ['tampon', 'pad', 'cup', 'brands'].includes(i)
      )
    ) throw new Error('menstruation_products object can only contains tampon, pad, cup and brands');
    if (
      typeof MP?.tampon !== 'boolean'
      && typeof MP?.pad !== 'boolean'
      && typeof MP?.cup !== 'boolean'
      && typeof MP?.brands !== 'object'
    ) throw new Error('one of the menstruation_products object values types is wrong');
  }
  return true;
};

const getInfo = [
  param('user_id')
    .trim()
    .notEmpty(),
];

const updateInfo = [
  body('email')
    .optional()
    .isEmail(),
  body('first_name')
    .optional()
    .trim()
    .notEmpty(),
  body('last_name')
    .optional()
    .trim()
    .notEmpty(),
  body('prefs')
    .optional()
    .custom(isValidPreferences),
];

const addRecordedDayForUser = [
  body('date')
    .notEmpty()
    .custom(isValidRecordedDate)
    .customSanitizer(sanitizeISOString),
  body('feelings')
    .optional()
    .isArray()
    .custom(isValidFeelings),
  body('symptoms')
    .optional()
    .isArray()
    .custom(isValidSymptoms),
  body('vaginal_discharge')
    .optional()
    .isArray()
    .custom(isValidVaginalDischarge),
  body('misc')
    .optional()
    .isArray()
    .custom(isValidMisc),
  body('bleeding_amount')
    .optional()
    .notEmpty()
    .custom(isValidBleedingAmount),
  body('bleeding_type')
    .optional()
    .trim()
    .notEmpty()
    .custom(isValidBleedingType),
  body('blood_color')
    .optional()
    .trim()
    .notEmpty()
    .custom(isValidBloodColor),
  body('pregnancy_test')
    .optional()
    .trim()
    .notEmpty()
    .custom(isValidPregnancyTest),
  body('sex_situation')
    .optional()
    .trim()
    .notEmpty()
    .custom(isValidSexSituation),
  body('medications')
    .optional()
    .trim()
    .notEmpty()
];

const updateRecordedDayForUser = [
  param('recorded_day_id')
    .optional()
    .trim()
    .notEmpty(),
  body('feelings')
    .optional()
    .isArray()
    .custom(isValidFeelings),
  body('symptoms')
    .optional()
    .isArray()
    .custom(isValidSymptoms),
  body('vaginal_discharge')
    .optional()
    .isArray()
    .custom(isValidVaginalDischarge),
  body('misc')
    .optional()
    .isArray()
    .custom(isValidMisc),
  body('bleeding_amount')
    .optional()
    .notEmpty()
    .custom(isValidBleedingAmount),
  body('bleeding_type')
    .optional()
    .trim()
    .notEmpty()
    .custom(isValidBleedingType),
  body('blood_color')
    .optional()
    .trim()
    .notEmpty()
    .custom(isValidBloodColor),
  body('pregnancy_test')
    .optional()
    .trim()
    .notEmpty()
    .custom(isValidPregnancyTest),
  body('sex_situation')
    .optional()
    .trim()
    .notEmpty()
    .custom(isValidSexSituation),
  body('medications')
    .optional()
    .trim()
    .notEmpty()
];

const deleteRecordedDayForUser = [
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

const getMenstrualCyclesForUser = [
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

const subscribeForPlan = [
  body('card')
    .notEmpty()
    .custom(isValidCard),
  body('product_id')
    .trim()
    .notEmpty(),
  body('price_id')
    .trim()
    .notEmpty(),
];

const createPost = [
  body('content')
    .notEmpty()
    .isLength({ min: 1, max: 144 }),
  body('parent_type')
    .optional()
    .trim()
    .notEmpty(),
  body('parent_id')
    .optional()
    .trim()
    .notEmpty(),
];

const getPosts = [
  query('from')
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .customSanitizer(sanitizeUnixEpoch),
  query('to')
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .customSanitizer(sanitizeUnixEpoch),
  query('limit')
    .optional()
    .trim()
    .notEmpty()
    .isNumeric(),
  query('query')
    .optional()
    .trim()
    .notEmpty(),
];

const deletePost = [
  param('post_id')
    .trim()
    .notEmpty(),
];

const getPost = [
  param('post_id')
    .trim()
    .notEmpty(),
  query('comments')
    .optional()
    .customSanitizer(sanitizeBoolean)
    .isBoolean(),
];

const likePost = [
  param('post_id')
    .trim()
    .notEmpty(),
];

const updateUserChallenge = [
  param('challenge_id')
    .trim()
    .notEmpty(),
  body('content')
    .notEmpty()
    .isLength({ min: 1, max: 2000 }),
];

const getChallengesHistory = [
  query('from')
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .customSanitizer(sanitizeUnixEpoch),
  query('to')
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .customSanitizer(sanitizeUnixEpoch),
];

module.exports = {
  getInfo,
  updateInfo,
  addRecordedDayForUser,
  updateRecordedDayForUser,
  deleteRecordedDayForUser,
  getRecordedDayForUser,
  getMenstrualCyclesForUser,
  subscribeForPlan,
  createPost,
  getPosts,
  deletePost,
  getPost,
  likePost,
  updateUserChallenge,
  getChallengesHistory,
};
