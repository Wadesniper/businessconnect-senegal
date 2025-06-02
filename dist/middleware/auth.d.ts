import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        email?: string;
        phone: string;
        role: 'admin' | 'etudiant' | 'annonceur' | 'employeur';
    };
}
declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id: string;
            firstName: string;
            lastName: string;
            email?: string;
            phone: string;
            role: 'admin' | 'etudiant' | 'annonceur' | 'employeur';
        };
    }
}
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const restrictTo: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
