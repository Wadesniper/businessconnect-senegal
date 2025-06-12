import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import { StorageService } from './storageService.js';
import { PaytechService, PaytechPaymentResult } from './paytechService.js';
import { UserService } from './userService.js';
import prisma from '../config/prisma.js';
import { $Enums } from '../../src/generated/prisma/index.js';

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
  private paytechService: PaytechService;
  private userService: UserService;

  constructor() {
    this.storageService = StorageService.getInstance();
    this.paytechService = new PaytechService();
    this.userService = new UserService();
  }

  public getSubscriptionPrice(type: string): number {
    return this.plans[type]?.price || 0;
  }

  async initiateSubscription(params: InitiateSubscriptionParams): Promise<{ paymentUrl?: string; transactionId?: string }> {
    try {
      logger.info('[ABO] Début initiateSubscription, params:', params);
      const existingSubscription = await this.getActiveSubscription(params.userId);
      if (existingSubscription) {
        logger.warn('[ABO] Abonnement déjà actif pour userId:', params.userId);
        throw new Error('Vous avez déjà un abonnement actif.');
      }
      const plan = this.plans[params.type];
      logger.info('[ABO] Plan trouvé:', plan);
      if (!plan) {
        logger.error('[ABO] Type d\'abonnement invalide:', params.type);
        throw new Error('Type d\'abonnement invalide.');
      }
      const refCommand = `BCS-${params.userId}-${Date.now()}`;
      const paytechParams = {
        item_name: `Abonnement ${plan.type}`,
        item_price: plan.price,
        ref_command: refCommand,
        command_name: `Abonnement ${plan.type} pour ${params.customer_email}`,
        custom_field: {
        userId: params.userId,
          type: params.type,
          email: params.customer_email
        }
      };
      logger.info('[ABO] Payload envoyé à PayTech:', paytechParams);
      const paymentResult: PaytechPaymentResult = await this.paytechService.createPayment(paytechParams);
      logger.info('[ABO] Résultat PayTech:', paymentResult);
      if (!paymentResult.success || !paymentResult.token || !paymentResult.redirect_url) {
        logger.error('[ABO] Échec initialisation paiement PayTech:', paymentResult);
        throw new Error(paymentResult.message || 'Erreur lors de l\'initialisation du paiement avec PayTech.');
      }
      logger.info('[ABO] Création entrée abonnement en base...');
      await this.createSubscriptionEntry(params.userId, params.type, paymentResult.token);
      logger.info('[ABO] Entrée abonnement créée avec succès');
      return {
        paymentUrl: paymentResult.redirect_url,
        transactionId: paymentResult.token
      };
    } catch (error) {
      logger.error('[ABO] Erreur détaillée lors de l\'initiation de l\'abonnement:', error);
      throw error;
    }
  }

  private async createSubscriptionEntry(userId: string, type: string, transactionId: string): Promise<SubscriptionData> {
    const plan = this.plans[type];
    if (!plan) {
      throw new Error('Type d\'abonnement invalide pour la création.');
    }

    // Création de l'abonnement dans la table Subscription via Prisma
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + plan.duration);
    const created = await prisma.subscription.create({
      data: {
      id: transactionId,
      userId,
        plan: type,
      status: 'pending',
      paymentId: transactionId,
        startDate: now,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      }
    });
    logger.info(`[ABO] Abonnement créé en base Prisma :`, created);
    return {
      id: created.id,
      userId: created.userId,
      type: created.plan,
      status: created.status,
      paymentId: created.paymentId!,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      activatedAt: undefined,
      expiresAt: created.endDate,
    };
  }

  async activateSubscription(userId: string, transactionId: string): Promise<{ success: boolean; subscription?: SubscriptionData }> {
    try {
      logger.info(`[ABO] Début activation abonnement pour userId: ${userId}, transactionId: ${transactionId}`);
      // Récupérer l'abonnement via Prisma
      const subscription = await prisma.subscription.findUnique({ where: { id: transactionId } });
      logger.info(`[ABO] Résultat récupération abonnement (Prisma):`, subscription);
      if (!subscription) {
        logger.error(`[ABO] Abonnement non trouvé pour transactionId: ${transactionId}`);
        throw new Error('Abonnement non trouvé.');
      }
      if (subscription.status === 'active') {
        logger.info(`[ABO] Abonnement ${subscription.id} déjà actif.`);
        return {
          success: true,
          subscription: {
            id: subscription.id,
            userId: subscription.userId,
            type: subscription.plan,
            status: subscription.status,
            paymentId: subscription.paymentId || '',
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
            activatedAt: subscription.startDate,
            expiresAt: subscription.endDate,
          }
        };
      }
      if (subscription.userId !== userId) {
        logger.error(`[ABO] Tentative d'activation non autorisée. Abonnement: ${transactionId}, User: ${userId}`);
          throw new Error('Activation non autorisée.');
      }
      const plan = this.plans[subscription.plan];
      if (!plan) {
        logger.error(`[ABO] Type d'abonnement invalide: ${subscription.plan}`);
        throw new Error('Type d\'abonnement invalide.');
      }
      // Mise à jour du rôle utilisateur (hors admin) dans la vraie base
      const validRoles = ['etudiant', 'annonceur', 'recruteur'] as const;
      let userDb = null;
      try {
        userDb = await prisma.user.update({
          where: { id: userId },
          data: { role: validRoles.includes(subscription.plan as any) ? ($Enums.UserRole as any)[subscription.plan] : $Enums.UserRole.pending }
        });
        logger.info(`[ABO] Rôle utilisateur mis à jour dans la BDD : ${userDb.role}`);
      } catch (err) {
        logger.error(`[ABO] Erreur update rôle utilisateur dans la BDD:`, err);
      }
      // Calcul de la nouvelle date d'expiration
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + plan.duration);
      // Mise à jour de l'abonnement
      const updated = await prisma.subscription.update({
        where: { id: transactionId },
        data: {
        status: 'active',
          updatedAt: now,
          startDate: now,
          endDate: expiresAt,
        }
      });
      logger.info(`[ABO] Abonnement activé en base Prisma :`, updated);
      // Création d'une transaction de paiement
      try {
        await prisma.transaction.create({
          data: {
            amount: plan.price,
            currency: 'XOF',
            status: 'completed',
            paymentGateway: 'paytech',
            gatewayTransactionId: transactionId,
            description: `Abonnement ${plan.type}`,
            userId: userId,
            subscriptionId: transactionId,
            createdAt: now,
            updatedAt: now,
          }
        });
        logger.info(`[ABO] Transaction de paiement enregistrée.`);
      } catch (err) {
        logger.error(`[ABO] Erreur lors de la création de la transaction de paiement:`, err);
      }
      return {
        success: true,
        subscription: {
          id: updated.id,
          userId: updated.userId,
          type: updated.plan,
          status: updated.status,
          paymentId: updated.paymentId || '',
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
          activatedAt: updated.startDate,
          expiresAt: updated.endDate,
        }
      };
    } catch (error) {
      logger.error('[ABO] Erreur activation abonnement:', error);
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
      const sub = await prisma.subscription.findFirst({ where: { paymentId } });
      if (!sub) return null;
      return {
        id: sub.id,
        userId: sub.userId,
        type: sub.plan,
        status: sub.status,
        paymentId: sub.paymentId!,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
        activatedAt: sub.startDate,
        expiresAt: sub.endDate,
      };
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