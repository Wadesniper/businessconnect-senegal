declare module 'express-validator' {
  import { Request } from 'express';

  export interface ValidationError {
    param: string;
    msg: string;
    location?: string;
    value?: any;
  }

  export interface ValidationResult {
    isEmpty(): boolean;
    array(): ValidationError[];
    formatWith(formatter: (error: ValidationError) => any): ValidationResult;
  }

  export interface ValidationChain {
    notEmpty(): ValidationChain;
    isEmail(): ValidationChain;
    isLength(options: { min?: number; max?: number }): ValidationChain;
    isArray(): ValidationChain;
    withMessage(message: string): ValidationChain;
  }

  export function check(field: string): ValidationChain;
  export function validationResult(req: Request): ValidationResult;
} 