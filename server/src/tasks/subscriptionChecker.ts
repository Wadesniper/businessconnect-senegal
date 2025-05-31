import { SubscriptionService } from '../services/subscriptionService';
import { logger } from '../utils/logger';

export class SubscriptionChecker {
  private subscriptionService: SubscriptionService;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  start(intervalInHours: number = 24): void {
    // Vérifier les abonnements toutes les X heures (par défaut 24h)
    const intervalInMs = intervalInHours * 60 * 60 * 1000;

    // Première vérification immédiate
    this.checkAllSubscriptions();

    // Planifier les vérifications suivantes
    this.checkInterval = setInterval(() => {
      this.checkAllSubscriptions();
    }, intervalInMs);

    logger.info('Démarrage du vérificateur d\'abonnements', { intervalInHours });
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      logger.info('Arrêt du vérificateur d\'abonnements');
    }
  }

  private async checkAllSubscriptions(): Promise<void> {
    try {
      const subscriptions = await this.subscriptionService.getAllSubscriptions();
      
      for (const subscription of subscriptions) {
        await this.subscriptionService.checkSubscriptionAccess(subscription.userId);
      }

      logger.info('Vérification des abonnements terminée', {
        subscriptionsChecked: subscriptions.length
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification des abonnements', { error });
    }
  }
} 