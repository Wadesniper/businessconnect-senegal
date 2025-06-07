import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import { cinetpayService, CreatePaymentResult } from './cinetpayService.js';
import { StorageService } from './storageService.js';

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

interface SubscriptionData {
  id: string;
  userId: string;
  type: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  paymentId: string;
  createdAt: Date;
  activatedAt?: Date;
  expiresAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

interface SubscriptionStatus {
  isActive: boolean;
  type?: string;
  expiresAt?: Date;
}

interface SubscriptionUpdateData extends Partial<SubscriptionData> {
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
    this.storageService = StorageService.getInstance();
  }

  public getSubscriptionPrice(type: string): number {
    return this.plans[type]?.price || 0;
  }

  async initiateSubscription(params: InitiateSubscriptionParams): Promise<{ paymentUrl?: string; transactionId?: string }> {
    try {
      const existingSubscription = await this.getActiveSubscription(params.userId);
      if (existingSubscription) {
        throw new Error('Vous avez déjà un abonnement actif.');
      }

      const plan = this.plans[params.type];
      if (!plan) {
        throw new Error('Type d\'abonnement invalide.');
      }

      const paymentDataForCinetPay = {
        amount: plan.price,
        description: `Abonnement ${plan.type} pour ${params.customer_email} - BusinessConnect`,
        userId: params.userId,
        customer_name: params.customer_name,
        customer_surname: params.customer_surname,
        customer_email: params.customer_email,
        customer_phone_number: params.customer_phone_number
      };

      const paymentResult: CreatePaymentResult = await cinetpayService.createPayment(paymentDataForCinetPay);

      if (!paymentResult.success || !paymentResult.transactionId || !paymentResult.paymentUrl) {
        logger.error('Échec de l\'initialisation du paiement CinetPay:', paymentResult);
        throw new Error(paymentResult.message || 'Erreur lors de l\'initialisation du paiement avec CinetPay.');
      }

      await this.createSubscriptionEntry(params.userId, params.type, paymentResult.transactionId);

      return {
        paymentUrl: paymentResult.paymentUrl,
        transactionId: paymentResult.transactionId
      };
    } catch (error) {
      logger.error('Erreur détaillée lors de l\'initiation de l\'abonnement:', error);
      throw error;
    }
  }

  private async createSubscriptionEntry(userId: string, type: string, transactionId: string): Promise<SubscriptionData> {
    const plan = this.plans[type];
    if (!plan) {
      throw new Error('Type d\'abonnement invalide pour la création.');
    }

    const subscription: SubscriptionData = {
      id: transactionId,
      userId,
      type,
      status: 'pending',
      paymentId: transactionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.storageService.save<SubscriptionData>('subscriptions', subscription);
    return subscription;
  }

  async activateSubscription(userId: string, transactionId: string): Promise<{ success: boolean; subscription?: SubscriptionData }> {
    try {
      const subscription = await StorageService.get<SubscriptionData>('subscriptions', transactionId);
      
      if (!subscription) {
        logger.warn(`Tentative d'activation d'un abonnement non trouvé par paymentId/id: ${transactionId} pour userId: ${userId}`);
        throw new Error('Abonnement non trouvé ou paiement non encore enregistré.');
      }

      if (subscription.status === 'active') {
        logger.info(`L'abonnement ${subscription.id} est déjà actif.`);
        return { success: true, subscription };
      }
      
      if (subscription.userId !== userId) {
          logger.error(`Tentative d'activation non autorisée de l'abonnement ${transactionId} par l'utilisateur ${userId}. L'abonnement appartient à ${subscription.userId}.`);
          throw new Error('Activation non autorisée.');
      }

      const plan = this.plans[subscription.type];
      if (!plan) {
        throw new Error('Type d\'abonnement invalide trouvé dans les données existantes.');
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + plan.duration);

      const updatedSubscriptionData: SubscriptionData = {
        ...subscription,
        status: 'active',
        activatedAt: new Date(),
        expiresAt,
        updatedAt: new Date(),
      };

      await this.storageService.save<SubscriptionData>('subscriptions', updatedSubscriptionData);

      return {
        success: true,
        subscription: updatedSubscriptionData
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
      return {
        isActive: true,
        type: subscription.type,
        expiresAt: subscription.expiresAt
      };
    } catch (error) {
      logger.error('Erreur checkSubscriptionStatus:', error);
      throw error;
    }
  }

  async getActiveSubscription(userId: string): Promise<SubscriptionData | null> {
    try {
      const allSubscriptions = await this.storageService.list<SubscriptionData>('subscriptions');
      const userActiveSubscriptions = allSubscriptions.filter((s: SubscriptionData) => 
        s.userId === userId && 
        s.status === 'active' &&
        s.expiresAt && new Date(s.expiresAt) > new Date()
      );

      if (userActiveSubscriptions.length === 0) {
        const userPendingOrExpired = allSubscriptions.filter((s: SubscriptionData) => s.userId === userId && s.status === 'active' && s.expiresAt && new Date(s.expiresAt) <= new Date());
        for (const sub of userPendingOrExpired) {
          logger.info(`Abonnement ${sub.id} pour l'utilisateur ${userId} est marqué comme expiré.`);
          await this.updateSubscription(sub.id, { status: 'expired' });
        }
        return null;
      }
      userActiveSubscriptions.sort((a: SubscriptionData, b: SubscriptionData) => (b.expiresAt?.getTime() || 0) - (a.expiresAt?.getTime() || 0));
      return userActiveSubscriptions[0];
    } catch (error) {
      logger.error(`Erreur lors de la récupération de l'abonnement actif pour l'utilisateur ${userId}:`, error);
      throw error;
    }
  }

  async getSubscriptionByPaymentId(paymentId: string): Promise<SubscriptionData | null> {
    try {
      return await StorageService.get<SubscriptionData>('subscriptions', paymentId);
    } catch (error) {
      logger.error(`Erreur lors de la récupération de l'abonnement par paymentId ${paymentId}:`, error);
      return null;
    }
  }

  async createSubscription(userId: string, type: string, paymentId: string): Promise<SubscriptionData> {
    try {
      const plan = this.plans[type];
      if (!plan) {
        throw new Error('Type d\'abonnement invalide');
      }

      const subscription: SubscriptionData = {
        id: paymentId,
        userId,
        type,
        status: 'pending',
        paymentId,
        createdAt: new Date()
      };

      await this.storageService.save<SubscriptionData>('subscriptions', subscription);
      return subscription;
    } catch (error) {
      logger.error('Erreur lors de la création de l\'abonnement:', error);
      throw error;
    }
  }

  public async handlePaymentCallback(paymentData: any): Promise<void> {
    logger.info('handlePaymentCallback reçu:', paymentData);

    const transactionId = paymentData.cpm_trans_id || paymentData.transaction_id;
    const userIdFromCallback = paymentData.cpm_custom || paymentData.customer_id;

    if (!transactionId) {
      logger.error('handlePaymentCallback: ID de transaction manquant dans les données du callback.');
      throw new Error('ID de transaction manquant dans le callback de paiement.');
    }

    const subscription = await this.getSubscriptionByPaymentId(transactionId);

    if (!subscription) {
      logger.error(`handlePaymentCallback: Abonnement non trouvé pour transactionId ${transactionId}.`);
      throw new Error('Abonnement non trouvé pour ce paiement.');
    }

    if (subscription.userId !== userIdFromCallback && userIdFromCallback) {
        logger.warn(`handlePaymentCallback: Discrepance d'userId. Abonnement ${transactionId} a userId ${subscription.userId}, callback a ${userIdFromCallback}`);
    }

    const paymentSuccessful = (paymentData.cpm_result === '00' && paymentData.cpm_trans_status === 'ACCEPTED') || paymentData.status === 'success';

    if (paymentSuccessful) {
      if (subscription.status !== 'active') {
        logger.info(`Activation de l'abonnement ${subscription.id} suite au callback de paiement réussi.`);
        await this.activateSubscription(subscription.userId, subscription.id); 
      } else {
        logger.info(`Abonnement ${subscription.id} déjà actif, callback de paiement réussi ignoré (idempotence).`);
      }
    } else {
      logger.warn(`Callback de paiement non réussi pour l'abonnement ${subscription.id}. Statut: ${paymentData.cpm_trans_status}, Résultat: ${paymentData.cpm_result}`);
      if (subscription.status !== 'cancelled' && subscription.status !== 'expired') {
        await this.updateSubscription(subscription.id, { status: 'cancelled' });
      }
    }
  }

  public async updateSubscriptionStatus(
    subscriptionId: string, 
    status: 'pending' | 'active' | 'expired' | 'cancelled'
  ): Promise<SubscriptionData> {
    return StorageService.get<SubscriptionData>('subscriptions', subscriptionId).then((subscription: SubscriptionData | null) => {
      if (!subscription) {
        throw new Error('Abonnement non trouvé pour mise à jour de statut');
      }
      const updatedSubscription: SubscriptionData = {
        ...subscription,
        status,
        updatedAt: new Date()
      };
      return this.storageService.save<SubscriptionData>('subscriptions', updatedSubscription);
    });
  }

  public async getSubscription(subscriptionId: string): Promise<SubscriptionData | null> {
    try {
        const subscription = await StorageService.get<SubscriptionData>('subscriptions', subscriptionId);
        return subscription;
    } catch (error) {
        logger.error(`Erreur dans getSubscription pour id ${subscriptionId}:`, error);
        throw error;
    }
  }

  public async checkSubscriptionAccess(userId: string, userRole?: string): Promise<boolean> {
    if (userRole === 'admin') return true;
    const sub = await this.getActiveSubscription(userId);
    return !!sub;
  }

  public async getPaymentHistory(userId: string): Promise<any[]> {
    try {
      const allSubscriptions = await this.storageService.list<SubscriptionData>('subscriptions');
      return allSubscriptions.filter((s: SubscriptionData) => s.userId === userId);
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'historique des paiements (abonnements) pour l\'utilisateur:', error);
      return [];
    }
  }

  public async getAllSubscriptions(): Promise<SubscriptionData[]> {
    try {
      return await this.storageService.list<SubscriptionData>('subscriptions');
    } catch (error) {
      logger.error('Erreur lors de la récupération de tous les abonnements:', error);
      return [];
    }
  }

  async updateSubscription(subscriptionId: string, data: SubscriptionUpdateData): Promise<SubscriptionData> {
    const subscription = await StorageService.get<SubscriptionData>('subscriptions', subscriptionId);
    if (!subscription) {
      throw new Error('Abonnement non trouvé pour la mise à jour.');
    }
    const updatedSubscription: SubscriptionData = {
       ...subscription,
       ...data,
       updatedAt: new Date() 
    };
    await this.storageService.save<SubscriptionData>('subscriptions', updatedSubscription);
    return updatedSubscription;
  }

  public async cancelSubscription(subscriptionId: string, userIdRequestingCancellation: string): Promise<void> {
    const subscription = await StorageService.get<SubscriptionData>('subscriptions', subscriptionId);
    if (!subscription) {
      throw new Error('Abonnement non trouvé pour annulation.');
    }
    if (subscription.userId !== userIdRequestingCancellation) {
        throw new Error('Action non autorisée pour annuler cet abonnement.');
    }

    await this.updateSubscription(subscriptionId, { status: 'cancelled', updatedAt: new Date() });
    logger.info(`Abonnement ${subscriptionId} annulé par l'utilisateur ${userIdRequestingCancellation}.`);
  }
}

export const subscriptionService = new SubscriptionService(); 