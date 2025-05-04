import { Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { logger } from '../utils/logger';
import { AuthenticatedRequest, ApiResponse } from '../types/controllers';
import { NotificationCreateData, BulkNotificationData, NotificationOptions } from '../types/notification';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  createNotification = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const notificationData: NotificationCreateData = {
        ...req.body,
        userId
      };

      const notification = await this.notificationService.createNotification(notificationData);

      res.status(201).json({
        success: true,
        data: notification
      });
    } catch (error) {
      logger.error('Erreur lors de la création de la notification:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la notification'
      });
    }
  };

  getNotificationById = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const notification = await this.notificationService.getNotificationById(req.params.id);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification non trouvée'
        });
      }

      if (notification.user.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé à cette notification'
        });
      }

      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de la notification:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la notification'
      });
    }
  };

  getNotificationsByUser = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const options: NotificationOptions = {
        isRead: req.query.isRead === 'true',
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined
      };

      const result = await this.notificationService.getNotificationsByUser(userId, options);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des notifications'
      });
    }
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const notification = await this.notificationService.markAsRead(req.params.id, userId);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification non trouvée'
        });
      }

      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      logger.error('Erreur lors du marquage de la notification comme lue:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du marquage de la notification comme lue'
      });
    }
  };

  markAllAsRead = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      await this.notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: 'Toutes les notifications ont été marquées comme lues'
      });
    } catch (error) {
      logger.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du marquage de toutes les notifications comme lues'
      });
    }
  };

  deleteNotification = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const success = await this.notificationService.deleteNotification(req.params.id, userId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Notification non trouvée'
        });
      }

      res.json({
        success: true,
        message: 'Notification supprimée avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression de la notification:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la notification'
      });
    }
  };

  deleteAllNotifications = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      await this.notificationService.deleteAllNotifications(userId);

      res.json({
        success: true,
        message: 'Toutes les notifications ont été supprimées'
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression de toutes les notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de toutes les notifications'
      });
    }
  };

  sendBulkNotifications = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const bulkData: BulkNotificationData = req.body;
      const notifications = await this.notificationService.sendBulkNotifications(bulkData);

      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi des notifications en masse:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi des notifications en masse'
      });
    }
  };

  getUnreadCount = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const count = await this.notificationService.getUnreadCount(userId);

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      logger.error('Erreur lors du comptage des notifications non lues:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du comptage des notifications non lues'
      });
    }
  };
} 