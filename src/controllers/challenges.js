const services = require('../services');
const globals = require('../globals');

const getChallengesList = async (req, res) => {
  if (!globals.challenges || req.query.update) globals.challenges = await services.challenges.getActiveChallenges();
  const r = globals.challenges.reduce((a, i) => {
    const type = i.type?.toLowerCase()?.replace(/[ -_]+/g, '_');
    if (!a[type]) a[type] = [];
    a[type].push(i);
    return a;
  }, {});
  return res.send(r);
};

module.exports = {
  getChallengesList,
};
