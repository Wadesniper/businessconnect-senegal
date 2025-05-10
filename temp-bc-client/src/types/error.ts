export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export interface ErrorResponse {
  status: string;
  message: string;
  statusCode: number;
  stack?: string;
}

export type ValidationError = {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  status: 'error';
  errors: ValidationError[];
}

export type ApiError = {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
} 