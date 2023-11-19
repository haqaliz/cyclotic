const services = require('../../services');

const createActivity = async (req, res) => {
  const context = {
    type: req.body.type,
    name: req.body.name ?? '',
    category: req.body.category ?? '',
    content: req.body.content ?? [],
  };
  await services.activities.createActivity(context);
  return res.sendStatus(200);
};

const updateActivity = async (req, res) => {
  const context = {
    activity_id: req.params.activity_id,
    type: req.body.type,
    name: req.body.name ?? '',
    category: req.body.category ?? '',
    content: req.body.content ?? [],
  };
  await services.activities.updateActivity(context);
  return res.sendStatus(200);
};

const deleteActivity = async (req, res) => {
  const context = {
    activity_id: req.params.activity_id,
  };
  await services.activities.deleteActivity(context);
  return res.sendStatus(200);
};

const getActivities = async (req, res) => {
  const context = {
    type: req.query.type,
  };
  const r = await services.activities.getActivities(context);
  return res.send(r);
};

module.exports = {
  createActivity,
  updateActivity,
  deleteActivity,
  getActivities,
};
