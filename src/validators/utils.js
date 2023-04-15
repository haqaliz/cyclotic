import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const r = validationResult(req);
  if (r.isEmpty()) return next();
  const errors = r.errors.map((i) => ({
    location: i.location,
    path: i.path,
    msg: i.msg,
  }));
  return res.status(422).json({ errors });
};

export default {
  validate,
};
