import { logger } from '../utils/logger';
import { InAppNotificationService } from './inAppNotificationService';

export interface NotificationConfig {
  daysBeforeExpiration: number[];  // Par exemple [7, 3, 1] pour notifier 7, 3 et 1 jours avant
}

export class NotificationService {
  private config: NotificationConfig = {
    daysBeforeExpiration: [7, 3, 1]  // Configuration par défaut
  };
  private inAppNotificationService: InAppNotificationService;

  constructor(config?: NotificationConfig) {
    if (config) {
      this.config = config;
    }
    this.inAppNotificationService = new InAppNotificationService();
  }

  async checkAndSendExpirationNotifications(subscription: {
    userId: string;
    type: string;
    endDate: Date;
    status: string;
  }): Promise<void> {
    try {
      if (subscription.status !== 'active') {
        return;
      }

      const daysUntilExpiration = this.calculateDaysUntilExpiration(subscription.endDate);
      
      if (this.config.daysBeforeExpiration.includes(daysUntilExpiration)) {
        await this.sendExpirationNotification(subscription, daysUntilExpiration);
      }
    } catch (error) {
      logger.error('Erreur lors de la vérification des notifications', {
        userId: subscription.userId,
        error
      });
    }
  }

  private calculateDaysUntilExpiration(endDate: Date): number {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private async sendExpirationNotification(
    subscription: { userId: string; type: string },
    daysRemaining: number
  ): Promise<void> {
    try {
      const title = 'Votre abonnement expire bientôt';
      const message = `Votre abonnement ${subscription.type} expirera dans ${daysRemaining} jour(s). Pour continuer à bénéficier de nos services, veuillez le renouveler.`;
      
      await this.inAppNotificationService.createNotification(
        subscription.userId,
        'subscription_expiration',
        title,
        message,
        {
          subscriptionType: subscription.type,
          daysRemaining,
          action: 'renewal'
        }
      );

      logger.info('Notification d\'expiration créée', {
        userId: subscription.userId,
        daysRemaining
      });
    } catch (error) {
      logger.error('Erreur lors de la création de la notification', {
        userId: subscription.userId,
        error
      });
    }
  }
} 