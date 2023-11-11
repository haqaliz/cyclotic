const services = require('../services');
const resources = require('../resources');
const globals = require('../globals');

const getToken = async (req, res) => {
  if (!req?.user || !req.headers.authorization) return res.sendStatus(401);
  const [_, token] = req.headers.authorization.split(' ');
  const user = await services.auth.verifyToken(token);
  if (!user) res.sendStatus(401);
  return res.send(user)
};

const getUserPublicInfo = async (req, res) => {
  const [metadata, completedChallenges] = await Promise.all([
    services.user.getUserMetadata({
      user_id: req.params.user_id,
    }),
    services.user.getUserChallenges({
      user_id: req.params.user_id,
      completed: true,
    }),
  ]);
  return res.send({
    first_name: metadata?.first_name,
    last_name: metadata?.last_name,
    completed_challenges: Object.values(completedChallenges.reduce((a, i) => {
      if (!a[i.challenge_id]) {
        a[i.challenge_id] = {
          challenge_id: i.challenge_id,
          history: {},
        };
      }
      const len = Object.keys(i?.content ?? {}).length;
      if (!a[i.challenge_id].history[len]) {
        a[i.challenge_id].history[len] = 0;
      }
      a[i.challenge_id].history[len] += 1;
      return a;
    }, {})).map((i) => ({
      ...i,
      history: Object.keys(i.history).map((j) => ({
        completed_days: parseInt(j, 10),
        count: i.history[j],
      })),
    })),
  });
};

const info = async (req, res) => {
  if (!req?.user) return res.sendStatus(401);
  const subscription = await services.subscriptions.getActiveSubscriptionForUser({
    user_id: req.user.uid,
  });
  const challenges = await services.user.getUserActiveChallenges({
    user_id: req.user.uid,
  });
  return res.status(200).send({
    id: req.user.uid,
    email: req.user.email,
    metadata: req.user.metadata,
    subscription,
    challenges: challenges.map((i) => i.challenge_id),
  });
};

const updateInfo = async (req, res) => {
  const context = {
    user_id: req.user.uid,
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    prefs: req.body.prefs,
  };
  if (context.email && req.user.email !== context.email) {
    req.user.email = context.email;
    globals.users[req.user.accessToken].email = context.email;
  }
  if (context.first_name || context.last_name || context.prefs) {
    req.user.metadata = await services.user.upsertUserMetadata(context);
  }
  return res.sendStatus(200);
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
  const r = await services.recordedDays
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
  const r = await services.recordedDays
    .updateRecordedDayForUser(recordedDayId, context);
  if (!r) return res.sendStatus(400);
  return res.sendStatus(200);
};

const deleteRecordedDayForUser = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    recorded_day_id: req.params.recorded_day_id,
  };
  const r = await services.recordedDays
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
  const r = await services.recordedDays.getRecordedDaysForUser(context);
  return res.send(r);
};

const getLatestMenstrualCycleStartForUser = async (req, res) => {
  const r = await services.recordedDays.getStartOfLastMenstrualCycleForUser(req.user?.uid);
  return res.send(r);
};

const getMenstrualCyclesForUser = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    from: req.query.from,
    to: req.query.to,
  };
  const r = await services.recordedDays.getMenstrualCyclesForUser(context);
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
  const r = await resources.stripe.subscribeForPlan(context);
  if (!r) return res.status(400).send('Product does not exist');
  const subscription = await services.subscriptions.addSubscriptionForUser({
    user_id: req.user?.uid,
    product_id: context.product_id,
    price_id: context.price_id,
    subscription_id: r.id,
  });
  if (!subscription) return res.status(400).send('You\'re already subscribed');
  return res.sendStatus(200);
};

const getRecommendationsForUser = async (req, res) => {
  const recommendations = await services.recommendations.getRecommendationsForUser(req.user);
  return res.send(recommendations)
};

const createPost = async (req, res) => {
  const hashtags = (req.body.content.match(/\#[a-zA-Z0-9_]+/gi) ?? []).map((i) => i.replace(/\#+/g, ''));
  const links = req.body.content.match(new RegExp('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})', 'gi')) ?? [];
  const context = {
    user_id: req.user?.uid,
    content: req.body.content,
    hashtags,
    links,
  };
  if (req.body.parent_id && req.body.parent_type) {
    context.parent_id = req.body.parent_id;
    context.parent_type = req.body.parent_type;
  }
  await services.user.createPostForUser(context);
  return res.sendStatus(200);
};

const getPosts = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    from: req.query.from,
    to: req.query.to,
    limit: req.query.limit || 100,
    query: req.query.query,
  };
  const r = await services.user.getPostsForUser(context);
  return res.send(r);
};

const deletePost = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    post_id: req.params.post_id,
  };
  const r = await services.user
    .deletePostForUser(context);
  if (!r) return res.sendStatus(400);
  return res.sendStatus(200);
};

const getPost = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    post_id: req.params.post_id,
    comments: req.query.comments,
  };
  const r = await services.user
    .getPostForUser(context);
  if (!r) return res.sendStatus(404);
  return res.send(r);
};

const likePost = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    post_id: req.params.post_id,
  };
  const r = await services.user
    .likePostForUser(context);
  if (!r) return res.sendStatus(404);
  return res.sendStatus(200);
};

const updateUserChallenge = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    challenge_id: req.params.challenge_id,
    content: req.body.content,
  };
  const r = await services.user
    .updateUserChallenge(context);
  if (!r) return res.sendStatus(404);
  return res.send(r);
};

const getChallengesHistory = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    from: req.query.from,
    to: req.query.to,
  };
  const r = await services.user.getUserChallenges(context);
  return res.send(r);
};

const getNotifications = async (req, res) => {
  const context = {
    user_id: req.user?.uid,
    from: req.query.from,
    to: req.query.to,
    type: req.query.type,
  };
  const r = await services.user.getUserNotifications(context);
  return res.send(r);
};

module.exports = {
  getToken,
  getUserPublicInfo,
  info,
  updateInfo,
  getRecordedDaysForUser,
  getLatestMenstrualCycleStartForUser,
  addRecordedDayForUser,
  updateRecordedDayForUser,
  deleteRecordedDayForUser,
  getMenstrualCyclesForUser,
  subscribeForPlan,
  getRecommendationsForUser,
  createPost,
  getPosts,
  deletePost,
  getPost,
  likePost,
  updateUserChallenge,
  getChallengesHistory,
  getNotifications,
};
