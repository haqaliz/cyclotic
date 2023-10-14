const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const miscRouter = require('./misc');
const authRouter = require('./auth');
const userRouter = require('./user');
const productsRouter = require('./products');
const globals = require('../globals');

const init = () => {
  const app = express();
  const port = 8081;

  app.use(cors());

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    if (req.headers.authorization) {
      const [_, token] = req.headers.authorization.split(' ');
      req.user = globals.users[token];
    }
    next();
  });

  app.use('/', miscRouter);
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/products', productsRouter);

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

module.exports = {
  init,
};
