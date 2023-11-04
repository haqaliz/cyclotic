const services = require('../services');
const globals = require('../globals');

const getChallengesList = async (req, res) => {
  if (!globals.challenges || req.query.update) globals.challenges = await services.challenges.getActiveChallenges();
  const r = globals.challenges.reduce((a, i) => {
    const type = i.type?.toLowerCase()?.replace(/[ -_]+/g, '_');
    if (!a[type]) a[type] = [];
    a[type].push({
      id: i.id,
      img: i.img,
      type: i.type,
      value: i.value,
    });
    return a;
  }, {});
  return res.send(r);
};

const getAcceptedChallenges = async (req, res) => {
  if (!globals.challenges || req.query.update) globals.challenges = await services.challenges.getActiveChallenges();
  const challenges = Object.fromEntries(globals.challenges.map((i) => [i.id, i]));
  const userChallenges = await services.user.getUserChallenges({
    user_id: req.user.uid,
  });
  return res.send(userChallenges.map((i) => ({
    ...i,
    challenge: challenges[i.challenge_id],
  })));
};

const getChallenge = async (req, res) => {
  if (!globals.challenges || req.query.update) globals.challenges = await services.challenges.getActiveChallenges();
  const r = globals.challenges.find((i) => i.id === req.params.challenge_id);
  const userChallenge = await services.user.getUserChallenge({
    user_id: req.user.uid,
    challenge_id: r.id,
  });
  return res.send({
    ...r,
    user_challenge: userChallenge,
  });
};

const acceptChallenge = async (req, res) => {
  if (!globals.challenges || req.query.update) globals.challenges = await services.challenges.getActiveChallenges();
  const r = await services.user.createUserChallenge({
    user_id: req.user.uid,
    challenge_id: req.params.challenge_id,
  });
  return res.send(r);
};

const rejectChallenge = async (req, res) => {
  if (!globals.challenges || req.query.update) globals.challenges = await services.challenges.getActiveChallenges();
  const r = await services.user.deleteUserChallenge({
    user_id: req.user.uid,
    challenge_id: req.params.challenge_id,
  });
  if (!r) return res.sendStatus(400);
  return res.sendStatus(200);
};

module.exports = {
  getChallengesList,
  getAcceptedChallenges,
  getChallenge,
  acceptChallenge,
  rejectChallenge,
};
