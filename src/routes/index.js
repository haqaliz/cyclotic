import express from 'express';
import bodyParser from 'body-parser';
import { firebase } from '../config.js';
import authRouter from './auth.js';
import usersRouter from './users.js';

const init = () => {
  const app = express();
  const port = 3000;

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

export default {
  init,
};
