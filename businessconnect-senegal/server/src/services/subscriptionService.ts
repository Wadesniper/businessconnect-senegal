import { Request, Response } from 'express';
import { PayTechConfig } from '../config/paytech';
import { NotificationService } from './notificationService';
import { v4 as uuidv4 } from 'uuid';
import { Subscription, SubscriptionType, SubscriptionStatus, PaymentInitiation, PayTechCallbackData } from '../types/subscription';
import { logger } from '../utils/logger';
import { config } from '../config';
import { Pool } from 'pg';
import { PayTech } from './paytechService';
import { Schema, model } from 'mongoose';

interface PayTechResponse {
  paymentId: string;
  redirectUrl: string;
  status: string;
  transactionId?: string;
}

interface ISubscription {
  userId: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  plan: string;
  paymentId?: string;
  startDate: Date;
  expiresAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: { type: String, required: true },
  status: { type: String, required: true },
  plan: { type: String, required: true },
  paymentId: { type: String },
  startDate: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const SubscriptionModel = model<ISubscription>('Subscription', subscriptionSchema);

const pool = new Pool({
  connectionString: config.DATABASE_URL
});

export class SubscriptionService {
  private notificationService: NotificationService;
  private payTechService: PayTech;
  
  constructor(notificationService: NotificationService, payTechService: PayTech) {
    this.notificationService = notificationService;
    this.payTechService = payTechService;
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

  public async initiatePayment(userId: string, type: SubscriptionType): Promise<PaymentInitiation> {
    try {
      const existingSubscription = await this.getActiveSubscription(userId);
      if (existingSubscription) {
        throw new Error('Utilisateur a déjà un abonnement actif');
      }

      const amount = this.getSubscriptionPrice(type);
      if (!amount) {
        throw new Error('Type d\'abonnement invalide');
      }

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

      if (!paymentData || !paymentData.id) {
        throw new Error('Échec de l\'initialisation du paiement');
      }

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
    } catch (error) {
      logger.error('Erreur lors de l\'initiation du paiement:', error);
      throw error;
    }
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

  public async updateSubscriptionStatus(subscriptionId: string, status: SubscriptionStatus): Promise<void> {
    const query = `
      UPDATE subscriptions 
      SET status = $1, 
          updated_at = NOW() 
      WHERE id = $2
    `;

    try {
      await pool.query(query, [status, subscriptionId]);
      logger.info('Subscription status updated successfully', { subscriptionId, status });
    } catch (error) {
      logger.error('Error updating subscription status:', error);
      throw error;
    }
  }

  public async getSubscription(userId: string): Promise<Subscription | null> {
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

  public async checkSubscriptionStatus(userId: string): Promise<boolean> {
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

  public async getPaymentHistory(userId: string): Promise<Subscription[]> {
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

  public async getAllSubscriptions(): Promise<Subscription[]> {
    try {
      const result = await pool.query('SELECT * FROM subscriptions ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      logger.error('Erreur lors de la récupération des abonnements', { error });
      throw new Error('Échec de la récupération des abonnements');
    }
  }

  public async getActiveSubscription(userId: string): Promise<Subscription | null> {
    const query = `
      SELECT * FROM subscriptions 
      WHERE user_id = $1 
        AND status = 'active' 
        AND end_date > NOW()
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting active subscription:', error);
      throw error;
    }
  }

  public async getSubscriptionByPaymentId(paymentId: string): Promise<Subscription | null> {
    const query = 'SELECT * FROM subscriptions WHERE payment_id = $1';
    const result = await pool.query(query, [paymentId]);
    return result.rows[0] || null;
  }

  public async createSubscription(data: {
    userId: string;
    type: SubscriptionType;
    status: SubscriptionStatus;
    paymentId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Subscription> {
    const now = new Date();
    const subscription: Subscription = {
      id: uuidv4(),
      userId: data.userId,
      type: data.type,
      status: data.status,
      paymentId: data.paymentId,
      startDate: data.startDate || now,
      endDate: data.endDate || new Date(now.setMonth(now.getMonth() + 1)),
      createdAt: now,
      updatedAt: now
    };

    const query = `
      INSERT INTO subscriptions (
        id, user_id, type, status, payment_id, start_date, end_date, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      subscription.id,
      subscription.userId,
      subscription.type,
      subscription.status,
      subscription.paymentId,
      subscription.startDate,
      subscription.endDate,
      subscription.createdAt,
      subscription.updatedAt
    ];

    try {
      const result = await pool.query(query, values);
      logger.info('Subscription created successfully', { subscriptionId: subscription.id });
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw error;
    }
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

  private calculateEndDate(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    return endDate;
  }

  async updateSubscription(userId: string, data: {
    status?: string;
    paymentId?: string;
    expiresAt?: Date;
  }) {
    const updates = [];
    const values = [userId];
    let valueCount = 2;

    if (data.status) {
      updates.push(`status = $${valueCount}`);
      values.push(data.status);
      valueCount++;
    }

    if (data.paymentId) {
      updates.push(`payment_id = $${valueCount}`);
      values.push(data.paymentId);
      valueCount++;
    }

    if (data.expiresAt) {
      updates.push(`expires_at = $${valueCount}`);
      values.push(data.expiresAt);
      valueCount++;
    }

    updates.push(`updated_at = NOW()`);

    const query = `
      UPDATE subscriptions 
      SET ${updates.join(', ')}
      WHERE user_id = $1 AND status != 'cancelled'
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async checkSubscriptionAccess(userId: string): Promise<boolean> {
    const subscription = await this.getActiveSubscription(userId);
    return !!subscription;
  }

  calculateExpiryDate(plan: string): Date {
    const now = new Date();
    if (plan === 'yearly') {
      return new Date(now.setFullYear(now.getFullYear() + 1));
    }
    // Par défaut, abonnement mensuel
    return new Date(now.setMonth(now.getMonth() + 1));
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.updateSubscriptionStatus(subscriptionId, 'expired');
  }
}

export const subscriptionService = new SubscriptionService(
  new NotificationService(),
  new PayTech(config.PAYTECH_API_KEY, config.PAYTECH_WEBHOOK_SECRET)
); 