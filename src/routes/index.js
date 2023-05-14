const express = require('express');
const bodyParser = require('body-parser');
const { firebase } = require('../config');
const authRouter = require('./auth');
const usersRouter = require('./users');

const init = () => {
  const app = express();
  const port = 8081;

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    req.user = firebase.auth.currentUser;
    next();
  });

  app.use('/auth', authRouter);
  app.use('/users', usersRouter);

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

module.exports = {
  init,
};
