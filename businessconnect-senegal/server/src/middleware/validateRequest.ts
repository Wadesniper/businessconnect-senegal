import { Request, Response, NextFunction } from 'express';
import { validationResult, type ValidationError } from 'express-validator';
import { ApiResponse } from '../types/global';

interface CustomValidationError {
  message: string;
  field: string;
}

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array()
        .filter((error): error is Extract<ValidationError, { type: 'field' }> => error.type === 'field')
        .map(error => ({
          message: error.msg,
          field: error.path
        }))
    } as ApiResponse<null>);
    return;
  }
  next();
}; 