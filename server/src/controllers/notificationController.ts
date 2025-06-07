import { Request, Response, AuthRequest } from '../types/custom.express.js';
import { logger } from '../utils/logger.js';
import { NotificationService } from '../services/notificationService.js';
import { InAppNotificationService } from '../services/inAppNotificationService.js';
import { Notification } from '../models/Notification.js';

export class NotificationController {
  async getUserNotifications(userId: string) {
    try {
      return await Notification.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { $set: { read: true } },
        { new: true }
      );
      if (!notification) {
        throw new Error('Notification non trouvée');
      }
      return notification;
    } catch (error) {
      logger.error('Erreur lors du marquage de la notification:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string) {
    try {
      await Notification.updateMany(
        { userId, read: false },
        { $set: { read: true } }
      );
    } catch (error) {
      logger.error('Erreur lors du marquage de toutes les notifications:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string, userId: string) {
    try {
      const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });
      if (!notification) {
        throw new Error('Notification non trouvée');
      }
      return notification;
    } catch (error) {
      logger.error('Erreur lors de la suppression de la notification:', error);
      throw error;
    }
  }
} 