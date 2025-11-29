import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import productRouter from './routes/product';

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

mongoose.connect(DB_ADDRESS);

app.use('/product', productRouter);

app.listen(PORT, () => {
  process.stdout.write(`Server is running on port ${PORT}\n`);
});