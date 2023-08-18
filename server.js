import express from 'express';

import db from './database/db.js';
import articleRouter from './routes/articleRoute.js';
import userRouter from './routes/userRoute.js';

const port = process.env.PORT || 3003;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.sync()
  .then(() => {
    console.log('Database connected!');
  })
  .catch((err) => {
    console.log('Failed to sync database', err);
  });

app.use('/api/user', userRouter);
app.use('/api/article', articleRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
