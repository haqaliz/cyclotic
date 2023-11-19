const services = require('../../services');

const createInsight = async (req, res) => {
  const context = {
    type: req.body.type,
    name: req.body.name ?? '',
    category: req.body.category ?? '',
    content: req.body.content ?? [],
  };
  await services.insights.createInsight(context);
  return res.sendStatus(200);
};

const updateInsight = async (req, res) => {
  const context = {
    insight_id: req.params.insight_id,
    type: req.body.type,
    name: req.body.name ?? '',
    category: req.body.category ?? '',
    content: req.body.content ?? [],
  };
  await services.insights.updateInsight(context);
  return res.sendStatus(200);
};

const deleteInsight = async (req, res) => {
  const context = {
    insight_id: req.params.insight_id,
  };
  await services.insights.deleteInsight(context);
  return res.sendStatus(200);
};

const getInsights = async (req, res) => {
  const context = {
    type: req.query.type,
  };
  const r = await services.insights.getInsights(context);
  return res.send(r);
};

module.exports = {
  createInsight,
  getInsights,
  updateInsight,
  deleteInsight,
};
