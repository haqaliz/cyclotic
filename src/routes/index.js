import express from 'express';
import authRouter from './auth.js';

const init = () => {
  const app = express();
  const port = 3000;

  app.get('/', authRouter);

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

export default {
  init,
};
