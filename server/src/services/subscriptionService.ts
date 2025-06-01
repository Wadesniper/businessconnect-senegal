import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { Subscription } from '../models/subscription';
import { cinetpayService } from './cinetpayService';

export class SubscriptionService {
  // Prix des abonnements en FCFA
  private readonly SUBSCRIPTION_PRICES: { [key: string]: number } = {
    etudiant: 1000,    // 1,000 FCFA / mois
    annonceur: 5000,   // 5,000 FCFA / mois
    recruteur: 9000    // 9,000 FCFA / mois
  };

  public getSubscriptionPrice(type: string): number {
    return this.SUBSCRIPTION_PRICES[type] || 0;
  }

  public async initiatePayment(params: {
    type: string,
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
      
      // Appel au service CinetPay pour obtenir le lien de paiement
      const payment = await cinetpayService.initializePayment({
        amount,
        transaction_id,
        customer_name: params.customer_name,
        customer_surname: params.customer_surname,
        customer_email: params.customer_email,
        customer_phone_number: params.customer_phone_number,
        description: `Abonnement ${params.type} BusinessConnect`
      });

      return {
        redirectUrl: payment.payment_url,
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

  public async getActiveSubscription(userId: string): Promise<any> {
    return Subscription.findOne({ userId, status: 'active', endDate: { $gt: new Date() } }).sort({ createdAt: -1 }).lean();
  }

  public async getSubscriptionByPaymentId(paymentId: string): Promise<any> {
    return Subscription.findOne({ paymentId }).lean();
  }

  public async createSubscription(userId: string, plan: string, paymentId?: string): Promise<any> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    const subscription = new Subscription({
      userId,
      plan: String(plan),
      status: 'pending',
      startDate,
      endDate,
      paymentId
    });
    await subscription.save();
    return subscription;
  }

  public async updateSubscription(userId: string, data: { status?: string; paymentId?: string; expiresAt?: Date }) {
    const last = await Subscription.findOne({ userId }).sort({ createdAt: -1 });
    if (!last) return null;
    if (data.status) last.status = data.status as 'pending' | 'active' | 'expired' | 'cancelled';
    if (data.paymentId) last.paymentId = data.paymentId;
    if (data.expiresAt) last.endDate = data.expiresAt;
    last.updatedAt = new Date();
    await last.save();
    return last;
  }

  public async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.updateSubscriptionStatus(subscriptionId, 'expired');
  }
}

export const subscriptionService = new SubscriptionService(); 