import { Router } from 'express';
import { Request, Response, NextFunction } from '../types/custom.express.js';
import { contactController } from '../controllers/contactController.js';

const router = Router();

// Wrapper pour gérer les erreurs asynchrones
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any> | any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Route pour envoyer un message de contact
router.post('/', asyncHandler(contactController.sendMessage));

export default router; 