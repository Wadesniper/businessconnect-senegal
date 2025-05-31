import { ValidationChain, ValidationError } from 'express-validator';

export type ValidatorFunction = ValidationChain;

export interface ValidationError {
  field: string;
  message: string;
  param: string;
  msg: string;
}

export interface ValidationResult {
  success: boolean;
  message: string;
  errors: ValidationError[];
}

export { ValidationChain };

declare module 'express-validator' {
  export function check(field: string): ValidationChain;
  export function validationResult(req: any): {
    isEmpty(): boolean;
    array(): ValidationError[];
  };
  export { ValidationChain, ValidationError };
} 