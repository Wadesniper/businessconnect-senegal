import express from 'express';
import { inAppNotificationService } from '../services/inAppNotificationService';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Récupérer toutes les notifications de l'utilisateur
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await inAppNotificationService.getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications' });
  }
});

// Récupérer les notifications non lues
router.get('/unread', authMiddleware, async (req, res) => {
  try {
    const notifications = await inAppNotificationService.getUnreadNotifications(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications non lues' });
  }
});

// Marquer une notification comme lue
router.put('/:notificationId/read', authMiddleware, async (req, res) => {
  try {
    await inAppNotificationService.markAsRead(req.user.id, req.params.notificationId);
    res.json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du marquage de la notification' });
  }
});

// Marquer toutes les notifications comme lues
router.put('/mark-all-read', authMiddleware, async (req, res) => {
  try {
    await inAppNotificationService.markAllAsRead(req.user.id);
    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du marquage des notifications' });
  }
});

// Supprimer une notification
router.delete('/:notificationId', authMiddleware, async (req, res) => {
  try {
    await inAppNotificationService.deleteNotification(req.user.id, req.params.notificationId);
    res.json({ message: 'Notification supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la notification' });
  }
});

export default router; 