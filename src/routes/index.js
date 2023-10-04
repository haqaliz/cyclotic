const express = require('express');
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

  app.get('/test', async (req, res) => {
    const nodemailer = require('nodemailer');
    const transport = nodemailer.createTransport({
      host: "mail.cyclo.dev",
      port: 465,
      auth: {
        user: "noreply@cyclo.dev",
        pass: "king_1374"
      }
    });
    const mailOptions = {
      to: 'haqaliz@aol.com',
      subject: 'heLLLLo',
      html: '<strong style="background-color: red; padding: 1rem; border-radius: 5px;">Heyyyyy</strong>',
    }
    await transport.sendMail(mailOptions);
    return res.sendStatus(200)
  })

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

module.exports = {
  init,
};
