import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Erreur serveur:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: Object.values(err.errors).map((error: any) => ({
        field: error.path,
        message: error.message
      }))
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Cette ressource existe déjà'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Erreur serveur'
  });
}; 