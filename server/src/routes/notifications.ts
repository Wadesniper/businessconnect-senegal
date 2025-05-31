import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';
import { notificationService } from '../services/notificationService';

const router = Router();

// Récupérer toutes les notifications d'un utilisateur
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user!.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
  }
});

// Récupérer les notifications non lues
router.get('/unread', async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await notificationService.getUnreadNotifications(req.user!.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications non lues' });
  }
});

// Marquer une notification comme lue
router.put('/:notificationId/read', async (req: AuthRequest, res: Response) => {
  try {
    const { notificationId } = req.params;
    await notificationService.markAsRead(req.user!.id, notificationId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du marquage de la notification' });
  }
});

// Marquer toutes les notifications comme lues
router.put('/read-all', async (req: AuthRequest, res: Response) => {
  try {
    await notificationService.markAllAsRead(req.user!.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du marquage des notifications' });
  }
});

// Supprimer une notification
router.delete('/:notificationId', async (req: AuthRequest, res: Response) => {
  try {
    const { notificationId } = req.params;
    await notificationService.deleteNotification(req.user!.id, notificationId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la notification' });
  }
});

export default router; 