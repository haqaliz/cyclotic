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
  await recordedDaysService
    .addRecordedDayForUser(context);
  return res.sendStatus(200);
};

export default {
  getRecordedDaysForUser,
  addRecordedDayForUser,
};
