import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { errors as celebrateErrors } from 'celebrate';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import errorHandler from './middlewares/error-handler';
import { NotFoundError } from './errors';
import { requestLogger, errorLogger } from './middlewares/logger';

dotenv.config();

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(DB_ADDRESS);

app.use('/product', productRouter);
app.use('/order', orderRouter);

app.use('*', (_req, _res, next) => next(new NotFoundError('Маршрут не найден')));

app.use(errorLogger);
app.use(celebrateErrors());
app.use(errorHandler);

app.listen(PORT, () => {
  process.stdout.write(`Server is running on port ${PORT}\n`);
});
