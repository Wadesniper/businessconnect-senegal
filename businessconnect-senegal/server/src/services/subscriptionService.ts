import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { config } from '../config';
import { Pool } from 'pg';
import { SubscriptionType, Subscription } from '../types/subscription';
import { cinetpayService } from './cinetpayService';

const pool = new Pool({
  connectionString: config.DATABASE_URL
});

export class SubscriptionService {
  // Prix des abonnements en FCFA
  private readonly SUBSCRIPTION_PRICES = {
    etudiant: 1000,    // 1,000 FCFA / mois
    annonceur: 5000,   // 5,000 FCFA / mois
    recruteur: 9000    // 9,000 FCFA / mois
  };

  private getSubscriptionPrice(type: SubscriptionType): number {
    return this.SUBSCRIPTION_PRICES[type];
  }

  public async initiatePayment(params: {
    type: SubscriptionType,
    customer_name: string,
    customer_surname: string,
    customer_email: string,
    customer_phone_number: string,
    userId: string
  }): Promise<{ redirectUrl: string; paymentId: string }> {
    try {
      const existingSubscription = await this.getActiveSubscription(params.userId);
      if (existingSubscription) {
        throw new Error('Utilisateur a déjà un abonnement actif');
      }

      const amount = this.getSubscriptionPrice(params.type);
      if (!amount) {
        throw new Error('Type d\'abonnement invalide');
      }

      const transaction_id = uuidv4();
      const paymentData = await cinetpayService.initializePayment({
        amount,
        transaction_id,
        customer_name: params.customer_name,
        customer_surname: params.customer_surname,
        customer_email: params.customer_email,
        customer_phone_number: params.customer_phone_number,
        description: `Abonnement ${params.type} BusinessConnect`,
      });
      return {
        redirectUrl: paymentData.payment_url,
        paymentId: transaction_id
      };
    } catch (error) {
      logger.error('Erreur lors de l\'initiation du paiement CinetPay:', error);
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

  public async updateSubscriptionStatus(_: string, __: string): Promise<any> {
    try {
      // Adapter selon le modèle utilisé (Mongoose ou SQL)
      // Ex: await SubscriptionModel.findByIdAndUpdate(...) ou requête SQL
      throw new Error('updateSubscriptionStatus à adapter selon le modèle');
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut de l\'abonnement:', error);
      throw error;
    }
  }

  public async getSubscription(_: string): Promise<any> {
    try {
      // Adapter selon le modèle utilisé
      throw new Error('getSubscription à adapter selon le modèle');
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
        await this.updateSubscriptionStatus(subscription.id, 'expired');
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

  public async createSubscription(_: string, __: any): Promise<any> {
    try {
      // Adapter selon le modèle utilisé
      throw new Error('createSubscription à adapter selon le modèle');
    } catch (error) {
      logger.error('Erreur lors de la création de l\'abonnement:', error);
      throw error;
    }
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
      values.push(data.expiresAt instanceof Date ? data.expiresAt.toISOString() : data.expiresAt);
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