import { Request } from 'express';
import { ValidationChain, ValidationError, Result } from 'express-validator';

declare module 'express-validator' {
  interface CustomValidationError extends ValidationError {
    param: string;
    msg: string;
    location?: string;
    value?: any;
  }

  interface CustomValidationResult extends Result<ValidationError> {
    isEmpty(): boolean;
    array(): CustomValidationError[];
    formatWith(formatter: (error: CustomValidationError) => any): CustomValidationResult;
  }

  interface CustomValidationChain extends ValidationChain {
    notEmpty(): this;
    isEmail(): this;
    isLength(options: { min?: number; max?: number }): this;
    isArray(): this;
    withMessage(message: string): this;
    optional(options?: { nullable?: boolean; checkFalsy?: boolean }): this;
    trim(): this;
    escape(): this;
    isString(): this;
    isNumeric(): this;
    isBoolean(): this;
    isDate(): this;
    isIn(values: any[]): this;
    custom(validator: (value: any, { req }: { req: Request }) => boolean | Promise<boolean>): this;
  }

  export function check(field: string): CustomValidationChain;
  export function body(field: string): CustomValidationChain;
  export function param(field: string): CustomValidationChain;
  export function query(field: string): CustomValidationChain;
  export function validationResult(req: Request): CustomValidationResult;
} 