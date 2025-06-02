import { Request, Response } from 'express';
import { IUser } from '../models/User';
interface AuthRequest extends Request {
    user?: IUser;
}
export declare const userController: {
    getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
export {};
