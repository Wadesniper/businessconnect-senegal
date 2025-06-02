import { Request, Response, NextFunction } from 'express';
export declare class FormationController {
    getFormations(req: Request, res: Response): Promise<void>;
    getFormationById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    accessFormation: (req: Request, res: Response, next: NextFunction) => void;
    getFormationsByCategory: (req: Request, res: Response, next: NextFunction) => void;
    createFormation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateFormation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteFormation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
