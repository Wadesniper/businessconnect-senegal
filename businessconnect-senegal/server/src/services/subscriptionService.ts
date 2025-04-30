import { Request, Response } from 'express';
import { PayTechConfig } from '../config/paytech';
import { NotificationService } from './notificationService';
import { v4 as uuidv4 } from 'uuid';
import { Subscription, SubscriptionType, SubscriptionStatus, PaymentInitiation, PayTechCallbackData } from '../types/subscription';
import { logger } from '../utils/logger';
import pool from '../config/database';
import { PayTech } from './paytechService';

interface PayTechResponse {
  paymentId: string;
  redirectUrl: string;
  status: string;
  transactionId?: string;
}

export class SubscriptionService {
  private subscriptions: Map<string, Subscription>;
  private notificationService: NotificationService;
  private payTechService: PayTech;
  
  constructor(notificationService: NotificationService, payTechService: PayTech) {
    this.subscriptions = new Map<string, Subscription>();
    this.notificationService = notificationService;
    this.payTechService = payTechService;
  }

  // Prix des abonnements en FCFA
  private readonly SUBSCRIPTION_PRICES = {
    etudiant: 5000,    // 5,000 FCFA / mois
    annonceur: 15000,   // 15,000 FCFA / mois
    recruteur: 25000    // 25,000 FCFA / mois
  };

  private getSubscriptionPrice(type: SubscriptionType): number {
    return this.SUBSCRIPTION_PRICES[type];
  }

  public async initiatePayment(userId: string, type: SubscriptionType): Promise<PaymentInitiation> {
    const existingSubscription = await this.getActiveSubscription(userId);
    if (existingSubscription) {
      throw new Error('Utilisateur a déjà un abonnement actif');
    }

    const amount = this.getSubscriptionPrice(type);
    const paymentData = await this.payTechService.createPaymentIntent({
      amount,
      currency: 'XOF',
      customer: userId,
      payment_method: 'card',
      metadata: {
        subscriptionType: type,
        userId
      }
    });

    const subscription = await this.createSubscription({
      userId,
      type,
      status: 'pending',
      paymentId: paymentData.id,
      startDate: new Date(),
      endDate: this.calculateEndDate(new Date()),
    });

    return {
      redirectUrl: paymentData.next_action?.redirect_url || '',
      paymentId: paymentData.id
    };
  }

  public async handlePaymentCallback(paymentData: PayTechCallbackData): Promise<void> {
    const subscription = await this.getSubscriptionByPaymentId(paymentData.paymentId);
    if (!subscription) {
      throw new Error('Souscription non trouvée');
    }

    if (paymentData.status === 'completed') {
      await this.updateSubscriptionStatus(subscription.id, 'active');
      await this.notificationService.sendPaymentSuccessNotification(subscription.userId);
    } else if (paymentData.status === 'failed') {
      await this.updateSubscriptionStatus(subscription.id, 'inactive');
      await this.notificationService.sendPaymentFailureNotification(subscription.userId);
    }
  }

  private async sendPaymentSuccessNotification(userId: string): Promise<void> {
    const title = 'Paiement réussi';
    const message = 'Votre paiement a été traité avec succès. Votre abonnement est maintenant actif.';
    await this.notificationService.inAppNotificationService.createNotification(
      userId,
      'payment_success',
      title,
      message,
      { action: 'subscription_activated' }
    );
  }

  private async sendPaymentFailureNotification(userId: string): Promise<void> {
    const title = 'Échec du paiement';
    const message = 'Votre paiement n\'a pas pu être traité. Veuillez réessayer ou contacter le support.';
    await this.notificationService.inAppNotificationService.createNotification(
      userId,
      'payment_failure',
      title,
      message,
      { action: 'retry_payment' }
    );
  }

  private async updateSubscriptionStatus(subscriptionId: string, status: SubscriptionStatus): Promise<void> {
    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new Error('Souscription non trouvée');
    }

    subscription.status = status;
    subscription.updatedAt = new Date();
    
    await this.saveSubscription(subscription);
    this.subscriptions.set(subscriptionId, subscription);
  }

  async getSubscription(userId: string): Promise<Subscription | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement:', error);
      throw error;
    }
  }

  async checkSubscriptionStatus(userId: string): Promise<boolean> {
    const subscription = await this.getSubscription(userId);
    
    if (!subscription || subscription.status !== 'active') {
      return false;
    }

    const now = new Date();
    if (now > subscription.endDate) {
      await this.updateSubscriptionStatus(subscription.id, 'inactive');
      return false;
    }

    return true;
  }

  async getPaymentHistory(userId: string): Promise<Subscription[]> {
    try {
      const result = await pool.query(
        'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'historique des paiements:', error);
      throw error;
    }
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    try {
      const result = await pool.query('SELECT * FROM subscriptions ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      logger.error('Erreur lors de la récupération des abonnements', { error });
      throw new Error('Échec de la récupération des abonnements');
    }
  }

  public async getActiveSubscription(userId: string): Promise<Subscription | null> {
    const subscription = await this.getSubscription(userId);
    if (subscription && subscription.status === 'active') {
      return subscription;
    }
    return null;
  }

  public async getSubscriptionByPaymentId(paymentId: string): Promise<Subscription | null> {
    const query = 'SELECT * FROM subscriptions WHERE payment_id = $1';
    const result = await pool.query(query, [paymentId]);
    return result.rows[0] || null;
  }

  private async saveSubscription(subscription: Subscription): Promise<void> {
    const query = `
      INSERT INTO subscriptions (id, user_id, type, status, payment_id, start_date, end_date, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE
      SET status = $4, updated_at = $8
    `;
    
    await pool.query(query, [
      subscription.id,
      subscription.userId,
      subscription.type,
      subscription.status,
      subscription.paymentId,
      subscription.startDate,
      subscription.endDate,
      subscription.updatedAt
    ]);
  }

  private async createSubscription(data: {
    userId: string;
    type: SubscriptionType;
    status: SubscriptionStatus;
    paymentId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<Subscription> {
    const subscription: Subscription = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.saveSubscription(subscription);
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  private calculateEndDate(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    return endDate;
  }
}

// Créer une instance du NotificationService et PayTech
const notificationService = new NotificationService();
const payTechService = new PayTech(
  process.env.PAYTECH_API_KEY || '',
  process.env.PAYTECH_WEBHOOK_SECRET
);

// Exporter l'instance du SubscriptionService
export const subscriptionService = new SubscriptionService(notificationService, payTechService); 