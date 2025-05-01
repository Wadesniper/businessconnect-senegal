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
import { ISubscription } from '../types/subscription';
import { Subscription as SubscriptionModel } from '../models/subscription';
import { PaymentService } from './paymentService';

interface PayTechResponse {
  paymentId: string;
  redirectUrl: string;
  status: string;
  transactionId?: string;
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
  private paymentService: PaymentService;
  private notificationService: NotificationService;
  
  constructor() {
    this.paymentService = new PaymentService();
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

      const paymentData = await this.paymentService.createPaymentIntent({
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

      const subscription = await this.createSubscription(userId, type);

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
      await this.updateSubscriptionStatus(subscription._id, 'active');
      await this.notificationService.sendPaymentSuccessNotification(subscription.userId);
    } else if (paymentData.status === 'failed') {
      await this.updateSubscriptionStatus(subscription._id, 'inactive');
      await this.notificationService.sendPaymentFailureNotification(subscription.userId);
    }
  }

  public async updateSubscriptionStatus(subscriptionId: string, status: string): Promise<ISubscription> {
    try {
      const subscription = await SubscriptionModel.findByIdAndUpdate(
        subscriptionId,
        { status },
        { new: true }
      );

      if (!subscription) {
        throw new Error('Abonnement non trouvé');
      }

      return subscription.toObject();
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut de l\'abonnement:', error);
      throw error;
    }
  }

  public async getSubscription(userId: string): Promise<ISubscription | null> {
    try {
      const subscription = await SubscriptionModel.findOne({ userId, status: 'active' });
      return subscription ? subscription.toObject() : null;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement:', error);
      throw error;
    }
  }

  public async checkSubscriptionStatus(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getSubscription(userId);
      if (!subscription || subscription.status !== 'active') {
        return false;
      }

      const now = new Date();
      if (now > new Date(subscription.endDate)) {
        await this.updateSubscriptionStatus(subscription._id, 'expired');
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Erreur lors de la vérification du statut de l\'abonnement:', error);
      return false;
    }
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

  public async createSubscription(userId: string, type: SubscriptionType): Promise<ISubscription> {
    try {
      const subscription = await SubscriptionModel.create({
        userId,
        plan: type,
        status: 'pending',
        startDate: new Date(),
        endDate: this.calculateEndDate(new Date())
      });

      return subscription.toObject();
    } catch (error) {
      logger.error('Erreur lors de la création de l\'abonnement:', error);
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

export const subscriptionService = new SubscriptionService(); 