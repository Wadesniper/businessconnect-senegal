import { Subscription, SubscriptionType, SubscriptionStatus, ISubscription } from '../models/subscription';
import { PaymentService } from './paymentService';
import { NotificationService } from './notificationService';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

interface PaymentInitiation {
  redirectUrl: string;
  paymentId: string;
}

export class SubscriptionService {
  private paymentService: PaymentService;
  private notificationService: NotificationService;

  constructor() {
    this.paymentService = new PaymentService();
    this.notificationService = new NotificationService();
  }

  private getSubscriptionPrice(type: SubscriptionType): number {
    const prices = {
      [SubscriptionType.BASIC]: 5000,
      [SubscriptionType.PREMIUM]: 15000,
      [SubscriptionType.ENTERPRISE]: 50000
    };
    return prices[type];
  }

  private getSubscriptionDuration(type: SubscriptionType): number {
    const durations = {
      [SubscriptionType.BASIC]: 30,
      [SubscriptionType.PREMIUM]: 30,
      [SubscriptionType.ENTERPRISE]: 30
    };
    return durations[type];
  }

  async initiateSubscription(userId: string, type: SubscriptionType): Promise<PaymentInitiation> {
    try {
      const activeSubscription = await this.getActiveSubscription(userId);
      if (activeSubscription) {
        throw new AppError('Un abonnement actif existe déjà', 400);
      }

      const amount = this.getSubscriptionPrice(type);
      const duration = this.getSubscriptionDuration(type);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration);

      const subscription = new Subscription({
        userId,
        type,
        amount,
        currency: 'XOF',
        endDate
      });

      await subscription.save();

      const paymentData = await this.paymentService.initializePayment(amount, `Abonnement ${type} BusinessConnect`);
      
      if (!paymentData.success || !paymentData.redirectUrl) {
        throw new AppError('Échec de l\'initialisation du paiement', 500);
      }

      subscription.paymentId = paymentData.paymentId;
      await subscription.save();

      return {
        redirectUrl: paymentData.redirectUrl,
        paymentId: paymentData.paymentId
      };
    } catch (error) {
      logger.error('Erreur lors de l\'initiation de l\'abonnement:', error);
      throw error;
    }
  }

  async handlePaymentCallback(paymentId: string, status: 'success' | 'failed'): Promise<void> {
    try {
      const subscription = await Subscription.findOne({ paymentId });
      if (!subscription) {
        throw new AppError('Abonnement non trouvé', 404);
      }

      if (status === 'success') {
        subscription.status = SubscriptionStatus.ACTIVE;
        await subscription.save();
        await this.notificationService.sendSubscriptionActivatedEmail(subscription.userId);
      } else {
        subscription.status = SubscriptionStatus.CANCELLED;
        await subscription.save();
        await this.notificationService.sendSubscriptionFailedEmail(subscription.userId);
      }
    } catch (error) {
      logger.error('Erreur lors du traitement du callback de paiement:', error);
      throw error;
    }
  }

  async getActiveSubscription(userId: string): Promise<ISubscription | null> {
    try {
      return await Subscription.findOne({
        userId,
        status: SubscriptionStatus.ACTIVE,
        endDate: { $gt: new Date() }
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement actif:', error);
      throw error;
    }
  }

  async cancelSubscription(userId: string, subscriptionId: string): Promise<void> {
    try {
      const subscription = await Subscription.findOne({
        _id: subscriptionId,
        userId,
        status: SubscriptionStatus.ACTIVE
      });

      if (!subscription) {
        throw new AppError('Abonnement non trouvé ou déjà annulé', 404);
      }

      subscription.status = SubscriptionStatus.CANCELLED;
      await subscription.save();
      await this.notificationService.sendSubscriptionCancelledEmail(userId);
    } catch (error) {
      logger.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      throw error;
    }
  }

  async checkSubscriptionAccess(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getActiveSubscription(userId);
      return !!subscription;
    } catch (error) {
      logger.error('Erreur lors de la vérification de l\'accès:', error);
      return false;
    }
  }
} 