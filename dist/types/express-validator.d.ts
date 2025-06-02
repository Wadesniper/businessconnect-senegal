import { Request } from 'express';
declare module 'express-validator' {
    interface ValidationError {
        param: string;
        msg: string;
        location?: string;
        value?: any;
    }
    interface ValidationResult {
        isEmpty(): boolean;
        array(): ValidationError[];
        formatWith(formatter: (error: ValidationError) => any): ValidationResult;
    }
    interface ValidationChain {
        notEmpty(): ValidationChain;
        isEmail(): ValidationChain;
        isLength(options: {
            min?: number;
            max?: number;
        }): ValidationChain;
        isArray(): ValidationChain;
        withMessage(message: string): ValidationChain;
        optional(options?: {
            nullable?: boolean;
            checkFalsy?: boolean;
        }): ValidationChain;
        trim(): ValidationChain;
        escape(): ValidationChain;
        isString(): ValidationChain;
        isNumeric(): ValidationChain;
        isBoolean(): ValidationChain;
        isDate(): ValidationChain;
        isIn(values: any[]): ValidationChain;
        custom(validator: (value: any, { req }: {
            req: Request;
        }) => boolean | Promise<boolean>): ValidationChain;
    }
    function check(field: string): ValidationChain;
    function body(field: string): ValidationChain;
    function param(field: string): ValidationChain;
    function query(field: string): ValidationChain;
    function validationResult(req: Request): ValidationResult;
}
