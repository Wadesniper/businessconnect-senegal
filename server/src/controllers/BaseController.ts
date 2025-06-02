import { Request, Response, Controller, ApiResponse } from '../types/express';
import { validationResult } from 'express-validator';
import { logger } from '../utils/logger';

export abstract class BaseController implements Controller {
  protected constructor() {}

  public handleError(error: Error, res: Response): void {
    logger.error('Erreur contrôleur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      errors: [{
        message: error.message
      }]
    });
  }

  public validateRequest(req: Request): ApiResponse | null {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return {
        success: false,
        errors: errors.array().map(error => ({
          message: error.msg,
          field: (error as any).param || (error as any).path
        }))
      };
    }
    return null;
  }

  protected sendSuccess<T>(res: Response, data?: T, message?: string): void {
    res.json({
      success: true,
      message,
      data
    });
  }

  protected sendError(res: Response, message: string, statusCode: number = 400, errors?: Array<{ message: string; field?: string }>): void {
    res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }
} 