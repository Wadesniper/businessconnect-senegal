import { Request, Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/controllers';
import { SubscriptionType, SubscriptionStatus } from '../types/subscription';
import { SubscriptionService } from '../services/subscriptionService';
import { PayTech } from '../services/paytechService';
import { NotificationService } from '../services/notificationService';
import { User } from '../models/User';
import { logger } from '../utils/logger';

const PLAN_PRICES: Record<SubscriptionType, number> = {
  'etudiant': 1000,    // 1,000 FCFA / mois
  'annonceur': 5000,   // 5,000 FCFA / mois
  'recruteur': 9000    // 9,000 FCFA / mois
};

export class SubscriptionController {
  private subscriptionService: SubscriptionService;
  private paytech: PayTech;
  private notificationService: NotificationService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
    this.paytech = new PayTech();
    this.notificationService = new NotificationService();
  }

  public async createSubscription(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse>> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const { type, paymentMethod } = req.body;

      const subscription = await this.subscriptionService.createSubscription({
        userId,
        type,
        paymentMethod
      });

      return res.status(201).json({
        success: true,
        data: subscription
      });
    } catch (error) {
      logger.error('Erreur lors de la création de l\'abonnement:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'abonnement'
      });
    }
  }

  public async renewSubscription(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse>> {
    try {
      const { subscriptionId } = req.params;
      const subscription = await this.subscriptionService.renewSubscription(subscriptionId);

      return res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      logger.error('Erreur lors du renouvellement de l\'abonnement:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du renouvellement de l\'abonnement'
      });
    }
  }

  public async cancelSubscription(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse>> {
    try {
      const { subscriptionId } = req.params;
      const { reason } = req.body;

      const subscription = await this.subscriptionService.cancelSubscription(subscriptionId, reason);

      return res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      logger.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'annulation de l\'abonnement'
      });
    }
  }

  public async getSubscriptionById(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse>> {
    try {
      const { subscriptionId } = req.params;
      const subscription = await this.subscriptionService.getSubscriptionById(subscriptionId);

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Abonnement non trouvé'
        });
      }

      return res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'abonnement'
      });
    }
  }

  public async getSubscriptionsByUser(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse>> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const subscriptions = await this.subscriptionService.getSubscriptionsByUser(userId);

      return res.json({
        success: true,
        data: subscriptions
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des abonnements:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des abonnements'
      });
    }
  }

  public async getActiveSubscription(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse>> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const subscription = await this.subscriptionService.getActiveSubscription(userId);

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Aucun abonnement actif trouvé'
        });
      }

      return res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement actif:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'abonnement actif'
      });
    }
  }

  public async checkSubscriptionStatus(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse>> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const { type } = req.params;
      const isActive = await this.subscriptionService.checkSubscriptionStatus(userId, type as SubscriptionType);

      return res.json({
        success: true,
        data: { isActive }
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification du statut de l\'abonnement:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification du statut de l\'abonnement'
      });
    }
  }

  public async getSubscriptionsByStatus(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse>> {
    try {
      const { status } = req.params;
      const subscriptions = await this.subscriptionService.getSubscriptionsByStatus(status as SubscriptionStatus);

      return res.json({
        success: true,
        data: subscriptions
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des abonnements par statut:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des abonnements'
      });
    }
  }

  public async getExpiringSubscriptions(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse>> {
    try {
      const { days } = req.query;
      const daysThreshold = days ? parseInt(days as string, 10) : 7;

      const subscriptions = await this.subscriptionService.getExpiringSubscriptions(daysThreshold);

      return res.json({
        success: true,
        data: subscriptions
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des abonnements expirants:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des abonnements expirants'
      });
    }
  }

  public async getSubscriptionPlans(_req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse>> {
    try {
      const plans = this.subscriptionService.getSubscriptionPlans();

      return res.json({
        success: true,
        data: plans
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des plans d\'abonnement:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des plans d\'abonnement'
      });
    }
  }

  public async handlePayTechWebhook(req: Request, res: Response): Promise<Response> {
    try {
      const { signature } = req.headers;
      const payload = req.body;

      // Vérifier la signature
      if (!this.paytech.verifyWebhookSignature(payload, signature as string)) {
        return res.status(400).json({
          success: false,
          message: 'Signature invalide'
        });
      }

      const { status, metadata } = payload;
      const { userId, type, duration } = metadata;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      if (status === 'success') {
        // Mettre à jour l'abonnement
        const now = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + duration);

        user.subscription = {
          plan: type,
          status: 'active',
          startDate: now,
          endDate,
          duration
        };

        await user.save();

        // Envoyer la notification
        await this.notificationService.sendPaymentSuccessNotification(userId);
      } else {
        // Envoyer la notification d'échec
        await this.notificationService.sendPaymentFailureNotification(userId);
      }

      return res.json({ success: true });
    } catch (error) {
      logger.error('Erreur lors du traitement du webhook:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du traitement du webhook'
      });
    }
  }

  public async getCurrentSubscription(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse>> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const user = await User.findById(userId).select('+subscription');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      return res.json({
        success: true,
        data: user.subscription || null
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'abonnement'
      });
    }
  }

  public async subscribe(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse>> {
    try {
      const { plan, duration } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const amount = PLAN_PRICES[plan as SubscriptionType];
      if (!amount) {
        return res.status(400).json({
          success: false,
          message: 'Plan ou durée invalide'
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Créer la session de paiement PayTech
      const paymentSession = await this.paytech.createPaymentSession({
        amount,
        description: `Abonnement ${plan} - ${duration} mois`,
        customerId: userId,
        customerEmail: user.email,
        metadata: {
          plan,
          duration,
          userId
        }
      });

      return res.json({
        success: true,
        data: paymentSession
      });
    } catch (error) {
      logger.error('Erreur lors de la souscription:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la souscription'
      });
    }
  }
} 