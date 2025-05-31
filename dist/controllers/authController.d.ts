import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';
declare class AuthController {
    private notificationService;
    constructor(notificationService: NotificationService);
    register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
export default AuthController;
