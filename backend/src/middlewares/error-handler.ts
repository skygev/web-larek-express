import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';

const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => res.status(err.statusCode).json({ message: err.message });

export default errorHandler;
