import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
declare class AuthMiddleware {
    authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    isAdmin: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
}
export declare const authMiddleware: AuthMiddleware;
export {};
