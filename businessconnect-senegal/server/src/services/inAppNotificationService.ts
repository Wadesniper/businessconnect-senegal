import { logger } from '../utils/logger';

export interface Notification {
  id: string;
  userId: string;
  type: 'subscription_expiration' | 'new_offer' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

export class InAppNotificationService {
  private notifications: Map<string, Notification[]> = new Map();

  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    data?: Record<string, any>
  ): Promise<Notification> {
    try {
      const notification: Notification = {
        id: this.generateNotificationId(),
        userId,
        type,
        title,
        message,
        isRead: false,
        createdAt: new Date(),
        data
      };

      const userNotifications = this.notifications.get(userId) || [];
      userNotifications.push(notification);
      this.notifications.set(userId, userNotifications);

      logger.info('Notification créée', { userId, type, title });
      return notification;
    } catch (error) {
      logger.error('Erreur lors de la création de la notification', { userId, error });
      throw new Error('Échec de la création de la notification');
    }
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      return this.notifications.get(userId) || [];
    } catch (error) {
      logger.error('Erreur lors de la récupération des notifications', { userId, error });
      throw new Error('Échec de la récupération des notifications');
    }
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      const notifications = await this.getUserNotifications(userId);
      return notifications.filter(notification => !notification.isRead);
    } catch (error) {
      logger.error('Erreur lors de la récupération des notifications non lues', { userId, error });
      throw new Error('Échec de la récupération des notifications non lues');
    }
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      const userNotifications = this.notifications.get(userId) || [];
      const notification = userNotifications.find(n => n.id === notificationId);
      
      if (notification) {
        notification.isRead = true;
        logger.info('Notification marquée comme lue', { userId, notificationId });
      }
    } catch (error) {
      logger.error('Erreur lors du marquage de la notification comme lue', { userId, notificationId, error });
      throw new Error('Échec du marquage de la notification comme lue');
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const userNotifications = this.notifications.get(userId) || [];
      userNotifications.forEach(notification => {
        notification.isRead = true;
      });
      logger.info('Toutes les notifications marquées comme lues', { userId });
    } catch (error) {
      logger.error('Erreur lors du marquage de toutes les notifications comme lues', { userId, error });
      throw new Error('Échec du marquage de toutes les notifications comme lues');
    }
  }

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      const userNotifications = this.notifications.get(userId) || [];
      const updatedNotifications = userNotifications.filter(n => n.id !== notificationId);
      this.notifications.set(userId, updatedNotifications);
      logger.info('Notification supprimée', { userId, notificationId });
    } catch (error) {
      logger.error('Erreur lors de la suppression de la notification', { userId, notificationId, error });
      throw new Error('Échec de la suppression de la notification');
    }
  }

  private generateNotificationId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 