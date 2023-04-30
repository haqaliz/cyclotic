import { recordedDays as recordedDaysService } from '../services/index.js';

export const getRecordedDaysForUser = async (req, res) => {
    const r = await recordedDaysService
      .getRecordedDaysForUser(req.params.id);
    return res.send(r);
};

export const addRecordedDayForUser = async (req, res) => {
  const context = {
    user_id: req.params.id,
    feelings: req.body.feelings,
    symptoms: req.body.symptoms,
    vaginal_discharge: req.body.vaginal_discharge,
    misc: req.body.misc,
    bleeding_amount: req.body.bleeding_amount,
    bleeding_type: req.body.bleeding_type,
    blood_color: req.body.blood_color,
    pregnancy_test: req.body.pregnancy_test,
    sex_situation: req.body.sex_situation,
    medications: req.body?.medications ?? null,
  };
  const r = await recordedDaysService
    .addRecordedDayForUser(context);
  if (!r) return res.sendStatus(400);
  return res.sendStatus(200);
};

export const updateRecordedDayForUser = async (req, res) => {
  const recordedDayId = req.params.recorded_day_id;
  const context = {
    user_id: req.params.id,
    feelings: req.body.feelings,
    symptoms: req.body.symptoms,
    vaginal_discharge: req.body.vaginal_discharge,
    misc: req.body.misc,
    bleeding_amount: req.body.bleeding_amount,
    bleeding_type: req.body.bleeding_type,
    blood_color: req.body.blood_color,
    pregnancy_test: req.body.pregnancy_test,
    sex_situation: req.body.sex_situation,
    medications: req.body?.medications ?? null,
  };
  const r = await recordedDaysService
    .updateRecordedDayForUser(recordedDayId, context);
  if (!r) return res.sendStatus(400);
  return res.sendStatus(200);
};

export const deleteRecordedDayForUser = async (req, res) => {
  const context = {
    user_id: req.params.id,
    recorded_day_id: req.params.recorded_day_id,
  };
  const r = await recordedDaysService
    .deleteRecordedDayForUser(context);
  if (!r) return res.sendStatus(400);
  return res.sendStatus(200);
};

export default {
  getRecordedDaysForUser,
  addRecordedDayForUser,
  updateRecordedDayForUser,
  deleteRecordedDayForUser,
};
