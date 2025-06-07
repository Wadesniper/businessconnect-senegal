import { Router } from 'express';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express.js';
import { authenticate } from '../middleware/auth.js';
import { NotificationController } from '../controllers/notificationController.js';

const router = Router();
const notificationController = new NotificationController();

// Wrapper pour gérer les erreurs asynchrones
const asyncHandler = (fn: (req: any, res: Response, next: NextFunction) => Promise<any> | any) => {
  return (req: any, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Routes protégées
router.get('/', authenticate, asyncHandler((req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'Authentification requise' });
  notificationController.getUserNotifications(req.user.id).then(data => res.json(data));
}));

router.patch('/:id/read', authenticate, asyncHandler((req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'Authentification requise' });
  notificationController.markAsRead(req.params.id, req.user.id).then(data => res.json(data));
}));

router.patch('/read-all', authenticate, asyncHandler((req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'Authentification requise' });
  notificationController.markAllAsRead(req.user.id).then(() => res.json({ message: 'Toutes les notifications ont été marquées comme lues' }));
}));

router.delete('/:id', authenticate, asyncHandler((req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'Authentification requise' });
  notificationController.deleteNotification(req.params.id, req.user.id).then(() => res.json({ message: 'Notification supprimée' }));
}));

export default router; 