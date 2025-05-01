import { PayTech } from '../config/paytech';
import { Subscription } from '../models/subscription';
import { User } from '../models/User';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  CANCELLED = 'cancelled'
}

export class SubscriptionService {
  private paytech: PayTech;

  constructor() {
    this.paytech = new PayTech();
  }

  async createSubscription(userId: string, planId: string): Promise<Subscription> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      const subscription = await Subscription.create({
        userId,
        planId,
        status: SubscriptionStatus.PENDING,
        startDate: new Date(),
        endDate: this.calculateEndDate(new Date())
      });

      return subscription;
    } catch (error) {
      logger.error('Erreur lors de la création de l\'abonnement:', error);
      throw new AppError('Erreur lors de la création de l\'abonnement', 500);
    }
  }

  async getSubscription(userId: string): Promise<Subscription | null> {
    try {
      return await Subscription.findOne({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement:', error);
      throw new AppError('Erreur lors de la récupération de l\'abonnement', 500);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) {
        throw new AppError('Abonnement non trouvé', 404);
      }

      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.cancelledAt = new Date();
      await subscription.save();

      return subscription;
    } catch (error) {
      logger.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      throw new AppError('Erreur lors de l\'annulation de l\'abonnement', 500);
    }
  }

  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) {
        throw new AppError('Abonnement non trouvé', 404);
      }

      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.startDate = new Date();
      subscription.endDate = this.calculateEndDate(new Date());
      subscription.renewedAt = new Date();
      await subscription.save();

      return subscription;
    } catch (error) {
      logger.error('Erreur lors du renouvellement de l\'abonnement:', error);
      throw new AppError('Erreur lors du renouvellement de l\'abonnement', 500);
    }
  }

  private calculateEndDate(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    return endDate;
  }
} 