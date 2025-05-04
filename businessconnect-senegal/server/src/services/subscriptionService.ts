import { NotificationService } from './notificationService';
import { 
  ISubscription, 
  SubscriptionType, 
  SubscriptionStatus, 
  SubscriptionPlan,
  SubscriptionDocument
} from '../types/subscription';
import { 
  PaymentInitiationResponse,
  PaymentWebhookData,
  PaymentCurrency,
  PaymentStatus
} from '../types/payment';
import { logger } from '../utils/logger';
import { PayTech } from './paytechService';
import { Types } from 'mongoose';
import { Subscription } from '../models/subscription';
import { PaymentService } from './paymentService';
import { User } from '../models/user';
import { AppError } from '../utils/appError';

interface ISubscriptionPlan extends SubscriptionPlan {
  features: string[];
}

const SUBSCRIPTION_PLANS: Record<SubscriptionType, ISubscriptionPlan> = {
  etudiant: {
    id: 'etudiant',
    name: 'Étudiant',
    type: 'etudiant',
    price: 5000,
    interval: 'month',
    features: [
      'Accès aux formations de base',
      'Création de CV simple',
      'Postulation aux offres standard'
    ]
  },
  annonceur: {
    id: 'annonceur',
    name: 'Annonceur',
    type: 'annonceur',
    price: 15000,
    interval: 'month',
    features: [
      'Accès à toutes les formations',
      'Création de CV avancé',
      'Postulation illimitée aux offres',
      'Support prioritaire'
    ]
  },
  recruteur: {
    id: 'recruteur',
    name: 'Recruteur',
    type: 'recruteur',
    price: 25000,
    interval: 'month',
    features: [
      'Accès complet à la plateforme',
      'CV personnalisés illimités',
      'Outils de recrutement avancés',
      'Support dédié 24/7'
    ]
  }
};

interface ISubscriptionCreate {
  userId: string;
  type: SubscriptionType;
  startDate: Date;
  endDate: Date;
  price: number;
  autoRenew: boolean;
}

export class SubscriptionService {
  private notificationService: NotificationService;
  private paymentService: PaymentService;
  private paytechService: PayTech;

  constructor(
    notificationService: NotificationService,
    paytechService: PayTech
  ) {
    this.notificationService = notificationService;
    this.paytechService = paytechService;
    this.paymentService = new PaymentService({
      apiKey: process.env.PAYTECH_API_KEY || '',
      apiSecret: process.env.PAYTECH_API_SECRET || '',
      webhookSecret: process.env.PAYTECH_WEBHOOK_SECRET || '',
      environment: (process.env.NODE_ENV === 'production') ? 'production' : 'development',
      baseUrl: process.env.PAYTECH_BASE_URL || 'https://paytech.sn'
    });
  }

  public async initiateSubscription(userId: string, type: SubscriptionType): Promise<PaymentInitiationResponse> {
    try {
      const user = await User.findById(userId).exec();
      
      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      const existingSubscription = await this.getActiveSubscription(userId);
      if (existingSubscription) {
        throw new AppError('Utilisateur a déjà un abonnement actif', 400);
      }

      const plan = SUBSCRIPTION_PLANS[type];
      if (!plan) {
        throw new AppError('Type d\'abonnement invalide', 400);
      }

      const subscription = await this.createSubscription({
        userId,
        type,
        startDate: new Date(),
        endDate: new Date(),
        price: plan.price,
        autoRenew: true
      });

      const paymentSession = await this.paytechService.createPaymentSession({
        amount: plan.price,
        description: `Abonnement ${plan.name}`,
        customerId: userId,
        customerEmail: user.email,
        metadata: {
          subscriptionId: subscription._id.toString(),
          subscriptionType: type
        }
      });

      return {
        success: true,
        data: {
          paymentId: paymentSession.id,
          amount: plan.price,
          currency: 'XOF' as PaymentCurrency,
          status: 'pending' as PaymentStatus,
          redirectUrl: paymentSession.paymentUrl
        }
      };
    } catch (error) {
      logger.error('Erreur lors de l\'initiation de l\'abonnement:', error);
      throw error;
    }
  }

  public async handlePaymentCallback(paymentData: PaymentWebhookData): Promise<void> {
    const existingSubscription = await Subscription.findOne({ paymentId: paymentData.paymentId }).exec();
    if (!existingSubscription) {
      throw new AppError('Souscription non trouvée', 404);
    }

    const subscriptionId = existingSubscription._id.toString();

    if (paymentData.status === 'completed') {
      await this.updateSubscriptionStatus(subscriptionId, 'active');
      await this.notificationService.sendPaymentSuccessNotification(existingSubscription.userId.toString());
    } else if (paymentData.status === 'failed') {
      await this.updateSubscriptionStatus(subscriptionId, 'inactive');
      await this.notificationService.sendPaymentFailureNotification(existingSubscription.userId.toString());
    }
  }

  public async createSubscription(data: ISubscriptionCreate): Promise<ISubscription> {
    const subscription = await Subscription.create({
      ...data,
      status: 'active'
    });

    await User.findByIdAndUpdate(data.userId, {
      $set: { subscription: subscription._id }
    });

    return this.formatSubscription(subscription);
  }

  public async updateSubscriptionStatus(subscriptionId: string, status: SubscriptionStatus): Promise<SubscriptionDocument> {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { status },
      { new: true }
    ).exec();

    if (!updatedSubscription) {
      throw new AppError('Abonnement non trouvé', 404);
    }

    return updatedSubscription;
  }

  public async getSubscription(id: string): Promise<ISubscription | null> {
    const subscription = await Subscription.findById(id)
      .populate('userId', 'name email');
    
    return subscription ? this.formatSubscription(subscription) : null;
  }

  public async checkSubscriptionStatus(userId: string): Promise<boolean> {
    try {
      const subscription = await Subscription.findOne({
        userId: new Types.ObjectId(userId),
        status: 'active',
        endDate: { $gt: new Date() }
      }).exec();

      return !!subscription;
    } catch (error) {
      logger.error('Erreur lors de la vérification du statut de l\'abonnement:', error);
      throw error;
    }
  }

  public async getActiveSubscription(userId: string): Promise<SubscriptionDocument | null> {
    try {
      return await Subscription.findOne({
        userId: new Types.ObjectId(userId),
        status: 'active',
        endDate: { $gt: new Date() }
      }).exec();
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement actif:', error);
      throw error;
    }
  }

  public async getSubscriptionByPaymentId(paymentId: string): Promise<SubscriptionDocument | null> {
    try {
      return await Subscription.findOne({ paymentId }).exec();
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement par ID de paiement:', error);
      throw error;
    }
  }

  public async cancelSubscription(id: string): Promise<ISubscription | null> {
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'cancelled',
          autoRenew: false
        }
      },
      { new: true }
    );

    if (!subscription) {
      return null;
    }

    await User.findByIdAndUpdate(subscription.userId, {
      $unset: { subscription: 1 }
    });

    return this.formatSubscription(subscription);
  }

  public async renewSubscription(id: string): Promise<ISubscription | null> {
    const subscription = await Subscription.findById(id);
    
    if (!subscription || !subscription.autoRenew) {
      return null;
    }

    const newEndDate = new Date(subscription.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      {
        $set: {
          endDate: newEndDate,
          status: 'active'
        }
      },
      { new: true }
    );

    return updatedSubscription ? this.formatSubscription(updatedSubscription) : null;
  }

  public getSubscriptionPlans(): typeof SUBSCRIPTION_PLANS {
    return SUBSCRIPTION_PLANS;
  }

  public async getSubscriptionById(subscriptionId: string): Promise<SubscriptionDocument | null> {
    try {
      return await Subscription.findById(subscriptionId).exec();
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement:', error);
      throw error;
    }
  }

  public async getSubscriptionsByUser(userId: string): Promise<SubscriptionDocument[]> {
    try {
      return await Subscription.find({ userId: new Types.ObjectId(userId) }).exec();
    } catch (error) {
      logger.error('Erreur lors de la récupération des abonnements de l\'utilisateur:', error);
      throw error;
    }
  }

  public async getSubscriptionsByStatus(status: SubscriptionStatus): Promise<SubscriptionDocument[]> {
    try {
      return await Subscription.find({ status }).exec();
    } catch (error) {
      logger.error('Erreur lors de la récupération des abonnements par statut:', error);
      throw error;
    }
  }

  public async getExpiringSubscriptions(daysThreshold: number): Promise<SubscriptionDocument[]> {
    try {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

      return await Subscription.find({
        status: 'active',
        endDate: {
          $lte: thresholdDate,
          $gt: new Date()
        }
      }).exec();
    } catch (error) {
      logger.error('Erreur lors de la récupération des abonnements expirants:', error);
      throw error;
    }
  }

  private formatSubscription(doc: any): ISubscription {
    const subscription = doc.toObject();
    return {
      ...subscription,
      id: subscription._id.toString(),
      userId: subscription.userId?._id || subscription.userId,
      type: subscription.type,
      autoRenew: subscription.autoRenew
    };
  }
} 