import { Types } from 'mongoose';
import { PaymentService } from './paymentService';
import { Subscription } from '../models/subscription';
import { User } from '../models/user';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export interface ISubscription {
  userId: Types.ObjectId;
  type: 'basic' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentId?: string;
}

export class SubscriptionService {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async createSubscription(
    userId: string,
    type: 'basic' | 'premium',
    autoRenew: boolean = false
  ): Promise<ISubscription> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (type === 'premium' ? 12 : 1));

    const subscription = await Subscription.create({
      userId: new Types.ObjectId(userId),
      type,
      status: 'active',
      startDate,
      endDate,
      autoRenew
    });

    return subscription.toObject();
  }

  async getSubscription(userId: string): Promise<ISubscription | null> {
    const subscription = await Subscription.findOne({
      userId: new Types.ObjectId(userId),
      status: 'active'
    }).lean();

    return subscription;
  }

  async cancelSubscription(subscriptionId: string): Promise<ISubscription | null> {
    const subscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { status: 'cancelled', autoRenew: false },
      { new: true }
    ).lean();

    return subscription;
  }

  async renewSubscription(subscriptionId: string): Promise<ISubscription | null> {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) return null;

    const newEndDate = new Date(subscription.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + (subscription.type === 'premium' ? 12 : 1));

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      {
        status: 'active',
        endDate: newEndDate,
        $inc: { renewalCount: 1 }
      },
      { new: true }
    ).lean();

    return updatedSubscription;
  }

  async checkSubscriptionStatus(userId: string): Promise<boolean> {
    const subscription = await this.getSubscription(userId);
    if (!subscription) return false;

    const now = new Date();
    return subscription.status === 'active' && subscription.endDate > now;
  }

  async processSubscriptionPayment(
    userId: string,
    subscriptionType: 'basic' | 'premium'
  ): Promise<{ success: boolean; paymentUrl?: string }> {
    try {
      const amount = subscriptionType === 'premium' ? 50000 : 5000; // en centimes
      const paymentIntent = await this.paymentService.createPayment({
        amount,
        currency: 'XOF',
        description: `Abonnement ${subscriptionType} BusinessConnect`,
        metadata: {
          userId,
          subscriptionType
        }
      });

      return {
        success: true,
        paymentUrl: paymentIntent.paymentUrl
      };
    } catch (error) {
      console.error('Erreur lors du traitement du paiement:', error);
      return { success: false };
    }
  }
} 