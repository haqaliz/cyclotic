const services = require('../../services');

const createRecommendation = async (req, res) => {
  const context = {
    type: req.body.type,
    brand: req.body.brand ?? '',
    name: req.body.name ?? '',
    url: req.body.url ?? '',
    img: req.body.img ?? '',
    price: req.body.price ?? {},
    features: req.body.features ?? [],
  };
  await services.recommendations.createRecommendation(context);
  return res.sendStatus(200);
};

const updateRecommendation = async (req, res) => {
  const context = {
    recommendation_id: req.params.recommendation_id,
    type: req.body.type,
    brand: req.body.brand ?? '',
    name: req.body.name ?? '',
    url: req.body.url ?? '',
    img: req.body.img ?? '',
    price: req.body.price ?? {},
    features: req.body.features ?? [],
  };
  await services.recommendations.updateRecommendation(context);
  return res.sendStatus(200);
};

const deleteRecommendation = async (req, res) => {
  const context = {
    recommendation_id: req.params.recommendation_id,
  };
  await services.recommendations.deleteRecommendation(context);
  return res.sendStatus(200);
};

const getRecommendations = async (req, res) => {
  const context = {
    type: req.query.type,
  };
  const r = await services.recommendations.getRecommendations(context);
  return res.send(r);
};

module.exports = {
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
  getRecommendations,
};
