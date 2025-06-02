import { Request, Response } from 'express';
export declare const authController: {
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updatePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteAccount(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllUsers(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
