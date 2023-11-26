const services = require('../../services');

const createMiscellaneous = async (req, res) => {
  const context = {
    key: req.body.key,
    value: req.body.value ?? '',
    metadata: req.body.metadata ?? {},
  };
  await services.miscellaneous.createMiscellaneous(context);
  return res.sendStatus(200);
};

const updateMiscellaneous = async (req, res) => {
  const context = {
    miscellaneous_id: req.params.miscellaneous_id,
    key: req.body.key,
    value: req.body.value ?? '',
    metadata: req.body.metadata ?? {},
  };
  await services.miscellaneous.updateMiscellaneous(context);
  return res.sendStatus(200);
};

const deleteMiscellaneous = async (req, res) => {
  const context = {
    miscellaneous_id: req.params.miscellaneous_id,
  };
  await services.miscellaneous.deleteMiscellaneous(context);
  return res.sendStatus(200);
};

const getMiscellaneousList = async (req, res) => {
  const context = {
    type: req.query.type,
  };
  const r = await services.miscellaneous.getMiscellaneousList(context);
  return res.send(r);
};

module.exports = {
  createMiscellaneous,
  updateMiscellaneous,
  deleteMiscellaneous,
  getMiscellaneousList,
};
