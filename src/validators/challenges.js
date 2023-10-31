const expressValidator = require('express-validator');

const { param, body, query } = expressValidator;

const sanitizeBoolean = (v) => {
    return /(t|yes|y|true|1)/i.test(v.toLowerCase());
};

const explore = [
    query('update')
      .optional()
        .customSanitizer(sanitizeBoolean)
        .isBoolean(),
  ];

module.exports = {
};
