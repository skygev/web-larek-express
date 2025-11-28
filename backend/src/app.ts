import express from 'express';
import cors from 'cors';

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});