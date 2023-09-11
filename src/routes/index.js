const https = require('https');
const express = require('express');
const fs = require('fs');
const cors = require('cors')
const bodyParser = require('body-parser');
const { firebase } = require('../config');
const authRouter = require('./auth');
const userRouter = require('./user');
const productsRouter = require('./products');

const init = () => {
  const app = express();
  const port = 8081;

  app.use(cors());

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    req.user = firebase.auth.currentUser;
    next();
  });

  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/products', productsRouter);

  const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
  };
  https.createServer(options, app)
    .listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
};

module.exports = {
  init,
};
