const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const { firebase } = require('../config');
const authRouter = require('./auth');
const userRouter = require('./user');
const productsRouter = require('./products');
const resources = require('../resources');

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

  app.get('/test', async (req, res) => {
    try {
      await resources.mailer.send('haqaliz@aol.com', 'hello', 'Yuck Fou')
    } catch (e) {
      console.log(e)
    }
    return res.sendStatus(200)
  })

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

module.exports = {
  init,
};
