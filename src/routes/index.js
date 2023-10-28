const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const miscRouter = require('./misc');
const userRouter = require('./user');
const productsRouter = require('./products');
const services = require('../services');
const globals = require('../globals');

const init = () => {
  const app = express();
  const port = 8081;

  app.use(cors());

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use(async (req, res, next) => {
    if (req.headers.authorization) {
      const [_, token] = req.headers.authorization.split(' ');
      try {
        const user = await services.auth.verifyToken(token);
        if (!(token in globals.users)) {
          const metadata = await services.user.getUserMetadata({
              user_id: user.user_id,
          });
          globals.users[token] = {
              uid: user?.user_id,
              email: user?.email,
              email_verified: user?.email_verified,
              metadata,
              accessToken: token,
          };
        }
        req.user = globals.users[token];
      } catch (error) {
        delete globals.users[token];
        req.user = null;
      }
    }
    next();
  });

  app.use('/', miscRouter);
  app.use('/user', userRouter);
  app.use('/products', productsRouter);

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

module.exports = {
  init,
};
