import { Request, Response } from 'express';
import { ValidatorFunction } from '../types/express-validator';
export declare const cvValidation: ValidatorFunction[];
export declare const cvController: {
    createCV: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateCV: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteCV: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getCV: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getAllCVs: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
