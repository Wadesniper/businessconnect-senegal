import { Router, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { Request, AuthRequest } from '../types/express';
import { authenticate } from '../middleware/auth';
import { NotificationController } from '../controllers/notificationController';

const router = Router();
const notificationController = new NotificationController();

// Middleware d'authentification pour toutes les routes
router.use(authenticate);

// Obtenir toutes les notifications de l'utilisateur
router.get('/', async (req: Request, res: ExpressResponse, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const notifications = await notificationController.getUserNotifications(authReq.user.id);
    return res.json(notifications);
  } catch (error) {
    next(error);
  }
});

// Marquer une notification comme lue
router.put('/:id/read', async (req: Request, res: ExpressResponse, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = authReq.params;
    await notificationController.markAsRead(id, authReq.user.id);
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Marquer toutes les notifications comme lues
router.put('/read-all', async (req: Request, res: ExpressResponse, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    await notificationController.markAllAsRead(authReq.user.id);
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Supprimer une notification
router.delete('/:id', async (req: Request, res: ExpressResponse, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = authReq.params;
    await notificationController.deleteNotification(id, authReq.user.id);
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router; 