import express from 'express';
import connectDb from './src/config/auth.mongo.js';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';

import productRouter from './src/routers/product.route.js';
import userRouter from './src/routers/user.route.js';
import authRouter from './src/routers/auth.route.js';

const app = express();

dotenv.config({ path: './src/config/.env' });

const port = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    res.send("salut les amis")
})

app.use('/products', productRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

connectDb().then(
  app.listen(3000, () => {
    console.log(`server is running on port ${port}`.green.underline);
  })
);
