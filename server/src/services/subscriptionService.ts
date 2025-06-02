import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { Subscription } from '../models/subscription';
import { cinetpayService } from './cinetpayService';
import { StorageService } from './storageService';

interface SubscriptionPlan {
  type: 'etudiant' | 'annonceur' | 'recruteur';
  price: number;
  duration: number;
}

interface InitiateSubscriptionParams {
  type: string;
  customer_name: string;
  customer_surname: string;
  customer_email: string;
  customer_phone_number: string;
  userId: string;
}

interface Subscription {
  id: string;
  userId: string;
  type: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  paymentId: string;
  createdAt: Date;
  activatedAt?: Date;
  expiresAt?: Date;
  [key: string]: unknown;
}

interface SubscriptionStatus {
  isActive: boolean;
  type?: string;
  expiresAt?: Date;
}

interface SubscriptionUpdateData extends Partial<Subscription> {
  status?: 'pending' | 'active' | 'expired' | 'cancelled';
}

export class SubscriptionService {
  private plans: Record<string, SubscriptionPlan> = {
    etudiant: {
      type: 'etudiant',
      price: 1000,
      duration: 30
    },
    annonceur: {
      type: 'annonceur',
      price: 5000,
      duration: 30
    },
    recruteur: {
      type: 'recruteur',
      price: 9000,
      duration: 30
    }
  };

  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  public getSubscriptionPrice(type: string): number {
    return this.plans[type]?.price || 0;
  }

  async initiateSubscription(params: InitiateSubscriptionParams) {
    try {
      // Vérifier si l'utilisateur a déjà un abonnement actif
      const existingSubscription = await this.getActiveSubscription(params.userId);
      if (existingSubscription) {
        throw new Error('Vous avez déjà un abonnement actif');
      }

      // Initier le paiement avec CinetPay
      const plan = this.plans[params.type];
      if (!plan) {
        throw new Error('Type d\'abonnement invalide');
        }

      const payment = await cinetpayService.initializePayment({
        amount: plan.price,
        customer_name: params.customer_name,
        customer_surname: params.customer_surname,
        customer_email: params.customer_email,
        customer_phone_number: params.customer_phone_number,
        description: `Abonnement ${plan.type} - BusinessConnect`
      });

      if (!payment.success || !payment.transaction_id) {
        throw new Error(payment.message || 'Erreur lors de l\'initialisation du paiement');
      }

      // Créer l'abonnement en attente
      await this.createSubscription(params.userId, params.type, payment.transaction_id);

      return {
        paymentUrl: payment.payment_url,
        transactionId: payment.transaction_id
      };
    } catch (error) {
      logger.error('Erreur lors de l\'initiation de l\'abonnement:', error);
      throw error;
    }
  }

  async activateSubscription(userId: string, type: string, paymentId: string) {
    try {
      const subscription = await this.getSubscriptionByPaymentId(paymentId);
      if (!subscription) {
        throw new Error('Abonnement non trouvé');
      }

      if (subscription.status === 'active') {
        throw new Error('Cet abonnement est déjà actif');
      }

      const plan = this.plans[type];
      if (!plan) {
        throw new Error('Type d\'abonnement invalide');
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + plan.duration);

      const updatedSubscription: Subscription = {
        ...subscription,
        status: 'active',
        activatedAt: new Date(),
        expiresAt
      };

      await this.storageService.save('subscriptions', updatedSubscription);

      return {
        success: true,
        subscription: updatedSubscription
      };
    } catch (error) {
      logger.error('Erreur lors de l\'activation de l\'abonnement:', error);
      throw error;
    }
  }

  async checkSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const subscription = await this.getActiveSubscription(userId);
      
      if (!subscription) {
        return { isActive: false };
      }

      const now = new Date();
      const expiresAt = new Date(subscription.expiresAt || now);
      const isActive = now < expiresAt;

      return {
        isActive,
        type: subscription.type,
        expiresAt
      };
    } catch (error) {
      logger.error('Erreur lors de la vérification du statut de l\'abonnement:', error);
      throw error;
    }
  }

  async getActiveSubscription(userId: string): Promise<Subscription | null> {
    try {
      const subscriptions = await this.storageService.list<Subscription>('subscriptions', {
        userId,
        status: 'active'
      });

      if (subscriptions.length === 0) {
        return null;
      }

      const subscription = subscriptions[0];
      const now = new Date();
      const expiresAt = new Date(subscription.expiresAt || now);

      if (now > expiresAt) {
        // Marquer l'abonnement comme expiré
        const expiredSubscription: Subscription = {
          ...subscription,
          status: 'expired'
        };
        await this.storageService.save('subscriptions', expiredSubscription);
        return null;
      }

      return subscription;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement actif:', error);
      throw error;
    }
  }

  async getSubscriptionByPaymentId(paymentId: string): Promise<Subscription | null> {
    try {
      const subscriptions = await this.storageService.list<Subscription>('subscriptions', {
        paymentId
      });

      return subscriptions.length > 0 ? subscriptions[0] : null;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement par paymentId:', error);
      throw error;
    }
  }

  async createSubscription(userId: string, type: string, paymentId: string): Promise<Subscription> {
    try {
      const plan = this.plans[type];
      if (!plan) {
        throw new Error('Type d\'abonnement invalide');
      }

      const subscription: Subscription = {
        id: paymentId,
        userId,
        type,
        status: 'pending',
        paymentId,
        createdAt: new Date()
      };

      await this.storageService.save('subscriptions', subscription);
      return subscription;
    } catch (error) {
      logger.error('Erreur lors de la création de l\'abonnement:', error);
      throw error;
    }
  }

  public async handlePaymentCallback(paymentData: any): Promise<void> {
    const subscription = await this.getSubscriptionByPaymentId(paymentData.paymentId);
    if (!subscription) {
      throw new Error('Souscription non trouvée');
    }

    // Adapter la logique callback CinetPay ici
    // if (paymentData.status === 'ACCEPTED') { ... }
  }

  public async updateSubscriptionStatus(subscriptionId: string, status: string): Promise<any> {
    return Subscription.findByIdAndUpdate(subscriptionId, { status, updatedAt: new Date() }, { new: true }).lean();
  }

  public async getSubscription(userId: string): Promise<any> {
    return Subscription.findOne({ userId }).sort({ createdAt: -1 }).lean();
  }

  public async checkSubscriptionAccess(userId: string, userRole?: string): Promise<boolean> {
    if (userRole === 'admin') return true;
    const sub = await this.getActiveSubscription(userId);
    return !!sub;
  }

  public async getPaymentHistory(userId: string): Promise<any[]> {
    return Subscription.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  public async getAllSubscriptions(): Promise<any[]> {
    return Subscription.find().sort({ createdAt: -1 }).lean();
  }

  async updateSubscription(userId: string, data: SubscriptionUpdateData): Promise<Subscription> {
    try {
      const subscription = await this.getActiveSubscription(userId);
      if (!subscription) {
        throw new Error('Abonnement non trouvé');
      }

      const updatedSubscription = await this.storageService.update<Subscription>('subscriptions', subscription.id, data);
      return updatedSubscription;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de l\'abonnement:', error);
      throw error;
    }
  }

  public async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.updateSubscriptionStatus(subscriptionId, 'expired');
  }
}

export const subscriptionService = new SubscriptionService(); 