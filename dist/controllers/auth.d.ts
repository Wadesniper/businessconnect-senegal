import { Request, Response } from 'express';
import { ValidatorFunction } from '../types/express-validator';
export declare const authValidation: ValidatorFunction[];
export declare const authController: {
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
