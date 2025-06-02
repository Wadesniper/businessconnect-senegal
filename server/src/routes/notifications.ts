import { Router, Request, Response, AuthRequest } from '../types/express';
import { authenticate } from '../middleware/auth';
import { NotificationController } from '../controllers/notificationController';

const router = Router();
const notificationController = new NotificationController();

// Middleware d'authentification pour toutes les routes
router.use(authenticate);

// Obtenir toutes les notifications de l'utilisateur
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await notificationController.getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
  }
});

// Marquer une notification comme lue
router.put('/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    await notificationController.markAsRead(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du marquage de la notification' });
  }
});

// Marquer toutes les notifications comme lues
router.put('/read-all', async (req: AuthRequest, res: Response) => {
  try {
    await notificationController.markAllAsRead(req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du marquage des notifications' });
  }
});

// Supprimer une notification
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await notificationController.deleteNotification(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la notification' });
  }
});

export default router; 