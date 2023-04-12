import { recordedDays as recordedDaysService } from '../services/index.js';

export const getRecordedDaysForUser = async (req, res) => {
    const r = await recordedDaysService
      .getRecordedDaysForUser(req.params.id);
    return res.send(r);
};

export const addRecordedDayForUser = async (req, res) => {
  const context = {
    user_id: req.params.id,
    // deconstruct body for whole data of recorded day
  };
  const r = await recordedDaysService
    .addRecordedDayForUser(context);
  if (!r) return res.sendStatus(400);
  return res.sendStatus(200);
};

export default {
  getRecordedDaysForUser,
  addRecordedDayForUser,
};
