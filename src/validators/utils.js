const expressValidator = require('express-validator');

const { validationResult } = expressValidator;

const isPrivileged = (req, res, next) => {
  if (!req?.user) return res.sendStatus(403);
  next();
};

const validate = (req, res, next) => {
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

module.exports = {
  isPrivileged,
  validate,
};
