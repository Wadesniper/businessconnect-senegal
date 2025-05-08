import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Erreur:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Erreur de validation',
      errors: Object.values(err.errors).map((error: any) => error.message)
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).json({
      status: 'error',
      message: 'Conflit de données'
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Erreur interne du serveur'
  });
}; 