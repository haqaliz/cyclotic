const services = require('../services');
const globals = require('../globals');
const recordedDaysService = services.recordedDays;
const subscriptionsService = services.subscriptions;
const stripeService = services.stripe;

const info = async (req, res) => {
  if (!req?.user) return;
  const subscription = await subscriptionsService.getActiveSubscriptionForUser({
    user_id: req.user.uid,
  });
  return res.status(200).send({
    id: req.user.uid,
    email: req.user.email,
    subscription,
  });
};

const addRecordedDayForUser = async (req, res) => {
  if (
    [
      'feelings', 'symptoms', 'vaginal_discharge',
      'misc', 'bleeding_amount', 'bleeding_type',
      'blood_color', 'pregnancy_test', 'sex_situation',
    ].every((i) => !Object.keys(req.body).includes(i))
  ) return res.sendStatus(400);
  const context = {
    user_id: req.user?.uid,
    created_at: req.body.date,
    feelings: req.body?.feelings ?? null,
    symptoms: req.body?.symptoms ?? null,
    vaginal_discharge: req.body?.vaginal_discharge ?? null,
    misc: req.body?.misc ?? null,
    bleeding_amount: req.body?.bleeding_amount ?? null,
    bleeding_type: req.body?.bleeding_type ?? null,
    blood_color: req.body?.blood_color ?? null,
    pregnancy_test: req.body?.pregnancy_test ?? null,
    sex_situation: req.body?.sex_situation ?? null,
    medications: req.body?.medications ?? null,
  };
  const r = await recordedDaysService
    .addRecordedDayForUser(context);
  if (!r) return res.sendStatus(400);
  return res.sendStatus(200);
};

const updateRecordedDayForUser = async (req, res) => {
  if (
    [
      'feelings', 'symptoms', 'vaginal_discharge',
      'misc', 'bleeding_amount', 'bleeding_type',
      'blood_color', 'pregnancy_test', 'sex_situation',
    ].every((i) => !Object.keys(req.body).includes(i))
  ) return res.sendStatus(400);
  const recordedDayId = req.params.recorded_day_id;
  const context = {
    user_id: req.user?.uid,
    feelings: req.body?.feelings ?? null,
    symptoms: req.body?.symptoms ?? null,
    vaginal_discharge: req.body?.vaginal_discharge ?? null,
    misc: req.body?.misc ?? null,
    bleeding_amount: req.body?.bleeding_amount ?? null,
    bleeding_type: req.body?.bleeding_type ?? null,
    blood_color: req.body?.blood_color ?? null,
    pregnancy_test: req.body?.pregnancy_test ?? null,
    sex_situation: req.body?.sex_situation ?? null,
    medications: req.body?.medications ?? null,
  };
  const r = await recordedDaysService
    .updateRecordedDayForUser(recordedDayId, context);
  if (!r) return res.sendStatus(400);
  return res.sendStatus(200);
};

const deleteRecordedDayForUser = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    recorded_day_id: req.params.recorded_day_id,
  };
  const r = await recordedDaysService
    .deleteRecordedDayForUser(context);
  if (!r) return res.sendStatus(400);
  return res.sendStatus(200);
};

const getRecordedDaysForUser = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    from: req.query.from,
    to: req.query.to,
  };
  const r = await recordedDaysService.getRecordedDaysForUser(context);
  return res.send(r);
};

const getLatestMenstrualCycleStartForUser = async (req, res) => {
  const r = await recordedDaysService.getStartOfLastMenstrualCycleForUser(req.user?.uid);
  return res.send(r);
};

const getMenstrualCyclesForUser = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    from: req.query.from,
    to: req.query.to,
  };
  const r = await recordedDaysService.getMenstrualCyclesForUser(context);
  return res.send(r);
};

const subscribeForPlan = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    email: req.user?.email,
    card: req.body.card,
    product_id: req.body.product_id,
    price_id: req.body.price_id,
  };
  const r = await stripeService.subscribeForPlan(context);
  if (!r) return res.status(400).send('Product does not exist');
  const subscription = await subscriptionsService.addSubscriptionForUser({
    user_id: req.user?.uid,
    product_id: context.product_id,
    price_id: context.price_id,
    subscription_id: r.id,
  });
  if (!subscription) return res.status(400).send('You\'re already subscribed');
  return res.sendStatus(200);
};

module.exports = {
  info,
  getRecordedDaysForUser,
  getLatestMenstrualCycleStartForUser,
  addRecordedDayForUser,
  updateRecordedDayForUser,
  deleteRecordedDayForUser,
  getMenstrualCyclesForUser,
  subscribeForPlan,
};
