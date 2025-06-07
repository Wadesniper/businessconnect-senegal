import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Une erreur est survenue sur le serveur';

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}; 