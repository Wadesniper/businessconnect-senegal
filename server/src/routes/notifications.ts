import { Router } from 'express';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express';
import { authenticate } from '../middleware/auth';
import { NotificationController } from '../controllers/notificationController';

const router = Router();
const notificationController = new NotificationController();

// Middleware d'authentification pour toutes les routes
router.use(authenticate);

// Obtenir toutes les notifications de l'utilisateur
const getUserNotificationsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }
    const notifications = await notificationController.getUserNotifications(authReq.user.id);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};
router.get('/', getUserNotificationsHandler);

// Marquer une notification comme lue
const markAsReadHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }
    const { id } = authReq.params;
    await notificationController.markAsRead(id, authReq.user.id);
    res.json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    next(error);
  }
};
router.put('/:id/read', markAsReadHandler);

// Marquer toutes les notifications comme lues
const markAllAsReadHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }
    await notificationController.markAllAsRead(authReq.user.id);
    res.json({ message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    next(error);
  }
};
router.put('/read-all', markAllAsReadHandler);

// Supprimer une notification
const deleteNotificationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }
    const { id } = authReq.params;
    await notificationController.deleteNotification(id, authReq.user.id);
    res.json({ message: 'Notification supprimée' });
  } catch (error) {
    next(error);
  }
};
router.delete('/:id', deleteNotificationHandler);

export default router; 