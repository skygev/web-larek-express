import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import {
  AppError,
  BadRequestError,
  ConflictError,
} from '../errors';

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  let error = err;

  if (error instanceof MongooseError.ValidationError) {
    error = new BadRequestError('Ошибка валидации данных');
  }

  if (error instanceof Error && error.message.includes('E11000')) {
    error = new ConflictError('Товар с таким title уже существует');
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Unexpected error: ${message}\n`);

  return res.status(500).json({ message: 'На сервере произошла ошибка' });
};

export default errorHandler;
