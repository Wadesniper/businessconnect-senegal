import { ValidationChain, ValidationError } from 'express-validator';
export interface ValidationResult {
    success: boolean;
    message?: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}
export type ValidatorFunction = ValidationChain;
export { ValidationError };
