import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Vous n\'avez pas la permission d\'effectuer cette action', 403));
    }
    next();
  };
}; 