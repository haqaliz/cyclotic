import { recordedDays as recordedDaysService } from '../services/index.js';

export const getRecordedDaysForUser = async (req, res) => {
    const r = await recordedDaysService.getRecordedDaysForUser(
        req.params.id,
    );
    return res.sendStatus(200);
};

export default {
  getRecordedDaysForUser,
};
