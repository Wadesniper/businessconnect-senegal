import { Request, Response } from 'express';
import { PayTechConfig } from '../config/paytech';
import { NotificationService } from './notificationService';
import { v4 as uuidv4 } from 'uuid';
import { Subscription, SubscriptionType, SubscriptionStatus, PaymentInitiation } from '../types/subscription';
import { logger } from '../utils/logger';

interface PayTechResponse {
  paymentId: string;
  redirectUrl: string;
  status: string;
  transactionId?: string;
}

export class SubscriptionService {
  private subscriptions: Map<string, Subscription>;
  private notificationService: NotificationService;
  
  constructor() {
    this.subscriptions = new Map();
    this.notificationService = new NotificationService();
  }

  // Prix des abonnements en FCFA
  private readonly SUBSCRIPTION_PRICES = {
    etudiant: 1000,    // 1,000 FCFA / mois
    annonceur: 5000,   // 5,000 FCFA / mois
    recruteur: 9000    // 9,000 FCFA / mois
  };

  private getSubscriptionPrice(type: SubscriptionType): number {
    return this.SUBSCRIPTION_PRICES[type];
  }

  async initiatePayment(userId: string, subscriptionType: SubscriptionType): Promise<PaymentInitiation> {
    try {
      // Vérifier si l'utilisateur a déjà un abonnement actif
      const existingSubscription = await this.getSubscription(userId);
      if (existingSubscription && existingSubscription.status === 'active') {
        throw new Error('Utilisateur a déjà un abonnement actif');
      }

      const amount = this.getSubscriptionPrice(subscriptionType);

      // Configurer le paiement PayTech
      const paymentData = {
        amount,
        description: `Abonnement ${subscriptionType} BusinessConnect Senegal`,
        customField: JSON.stringify({
          userId,
          subscriptionType
        })
      };

      // Initialiser le paiement avec PayTech
      const paymentResponse = await PayTechConfig.initiatePayment(paymentData);
      
      logger.info('Paiement initié avec PayTech', { userId, subscriptionType, amount });

      // Créer un abonnement en attente
      const subscription: Subscription = {
        id: uuidv4(),
        userId,
        type: subscriptionType,
        status: 'pending',
        startDate: new Date(),
        endDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentId: paymentResponse.paymentId
      };

      this.subscriptions.set(userId, subscription);

      return {
        redirectUrl: paymentResponse.redirectUrl,
        paymentId: paymentResponse.paymentId
      };
    } catch (error) {
      logger.error('Erreur lors de l\'initiation du paiement', { userId, error });
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Échec de l\'initiation du paiement');
    }
  }

  async handlePaymentCallback(paymentData: any): Promise<Subscription> {
    try {
      const { customField, transactionId, status } = paymentData;
      const { userId, subscriptionType } = JSON.parse(customField);

      const subscription = this.subscriptions.get(userId);
      if (!subscription) {
        throw new Error('Abonnement non trouvé');
      }

      if (status === 'completed') {
        subscription.status = 'active';
        subscription.transactionId = transactionId;
        
        // Mettre à jour la date de fin (1 mois à partir de maintenant)
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        subscription.endDate = endDate;

        this.subscriptions.set(userId, subscription);
        logger.info('Paiement complété et abonnement activé', { userId, transactionId, subscriptionType });
      } else {
        subscription.status = 'expired';
        this.subscriptions.set(userId, subscription);
        logger.warn('Paiement échoué', { userId, transactionId, status });
      }

      return subscription;
    } catch (error) {
      logger.error('Erreur lors du traitement du callback de paiement', { error });
      throw new Error('Échec du traitement du callback de paiement');
    }
  }

  async createSubscription(userId: string, type: SubscriptionType): Promise<Subscription> {
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Abonnement d'un mois

    const subscription: Subscription = {
      id: uuidv4(),
      userId,
      type,
      status: 'pending',
      startDate: now,
      endDate,
      createdAt: now,
      updatedAt: now
    };

    this.subscriptions.set(userId, subscription);
    logger.info(`Nouvelle souscription créée pour l'utilisateur ${userId}`);
    
    return subscription;
  }

  async getSubscription(userId: string): Promise<Subscription | null> {
    const subscription = this.subscriptions.get(userId);
    return subscription || null;
  }

  async updateSubscriptionStatus(userId: string, status: SubscriptionStatus): Promise<Subscription | null> {
    const subscription = this.subscriptions.get(userId);
    
    if (!subscription) {
      logger.warn(`Tentative de mise à jour d'une souscription inexistante pour l'utilisateur ${userId}`);
      return null;
    }

    subscription.status = status;
    subscription.updatedAt = new Date();
    this.subscriptions.set(userId, subscription);

    logger.info(`Statut de la souscription mis à jour pour l'utilisateur ${userId}: ${status}`);
    return subscription;
  }

  async checkSubscriptionStatus(userId: string): Promise<boolean> {
    const subscription = this.subscriptions.get(userId);
    
    if (!subscription) {
      return false;
    }

    if (subscription.status !== 'active') {
      return false;
    }

    const now = new Date();
    if (now > subscription.endDate) {
      await this.updateSubscriptionStatus(userId, 'expired');
      return false;
    }

    return true;
  }

  async getPaymentHistory(userId: string): Promise<Subscription[]> {
    const subscription = this.subscriptions.get(userId);
    return subscription ? [subscription] : [];
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    try {
      return Array.from(this.subscriptions.values());
    } catch (error) {
      logger.error('Erreur lors de la récupération des abonnements', { error });
      throw new Error('Échec de la récupération des abonnements');
    }
  }
}

export const subscriptionService = new SubscriptionService(); 