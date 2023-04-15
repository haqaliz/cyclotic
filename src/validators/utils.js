import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const r = validationResult(req);
  if (r.isEmpty()) return next();
  let errors = {};
  r.errors.forEach((i) => {
    errors[i.path] = {
      location: i.location,
      path: i.path,
      msg: i.msg,
    };
  });
  return res.status(422).json({
    errors: Object.values(errors),
  });
};

export default {
  validate,
};
