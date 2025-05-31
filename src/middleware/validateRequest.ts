import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { ValidationResult } from '../types/express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationResponse: ValidationResult = {
      success: false,
      message: 'Erreur de validation',
      errors: errors.array().map((error: ValidationError) => ({
        field: error.param,
        message: error.msg,
        param: error.param,
        msg: error.msg
      }))
    };
    res.status(400).json(validationResponse);
    return;
  }
  next();
}; 