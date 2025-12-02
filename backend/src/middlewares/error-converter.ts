import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { AppError, BadRequestError, ConflictError } from '../errors';

const errorConverter = (
  err: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  let error = err;

  if (error instanceof MongooseError.ValidationError) {
    error = new BadRequestError('Ошибка валидации данных');
  } else if (error instanceof Error && error.message.includes('E11000')) {
    error = new ConflictError('Товар с таким title уже существует');
  } else if (!(error instanceof AppError)) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Unexpected error: ${message}\n`);
    error = new AppError('На сервере произошла ошибка', 500);
  }

  next(error);
};

export default errorConverter;
