import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { logger } from '../utils/logger';
import { PaymentData, SubscriptionType, PayTechCallbackData } from '../types/subscription';
import { PayTechConfig } from '../config/paytech';
import { NotificationService, NotificationConfig } from '../services/notificationService';
import { PayTech } from '../services/paytechService';

// Initialisation des services
const notificationConfig: NotificationConfig = {
  daysBeforeExpiration: [7, 3, 1]
};
const notificationService = new NotificationService(notificationConfig);
const payTechService = new PayTech(
  process.env.PAYTECH_API_KEY || '',
  process.env.PAYTECH_WEBHOOK_SECRET,
  process.env.PAYTECH_API_URL || 'https://api.paytech.sn'
);
const subscriptionService = new SubscriptionService(notificationService, payTechService);

const SUBSCRIPTION_PRICES: Record<SubscriptionType, number> = {
  etudiant: 1000,    // 1,000 FCFA / mois
  annonceur: 5000,   // 5,000 FCFA / mois
  recruteur: 9000    // 9,000 FCFA / mois
};

const VALID_SUBSCRIPTION_TYPES: SubscriptionType[] = ['etudiant', 'annonceur', 'recruteur'];

export const subscriptionController = {
  async createSubscription(req: Request, res: Response) {
    try {
      const { userId, type } = req.body;

      if (!userId || !type) {
        return res.status(400).json({ 
          success: false, 
          message: 'UserId et type d\'abonnement sont requis' 
        });
      }

      const subscription = await subscriptionService.createSubscription({
        userId,
        type: type as SubscriptionType,
        status: 'pending',
        paymentId: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
      });

      logger.info(`Nouvel abonnement créé pour l'utilisateur ${userId}`);
      
      res.status(201).json({
        success: true,
        data: subscription
      });
    } catch (error) {
      logger.error('Erreur lors de la création de l\'abonnement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'abonnement'
      });
    }
  },

  async getSubscription(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'UserId est requis'
        });
      }

      const subscription = await subscriptionService.getSubscription(userId);
      
      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Abonnement non trouvé'
        });
      }

      res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'abonnement'
      });
    }
  },

  async updateSubscriptionStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      if (!userId || !status) {
        return res.status(400).json({
          success: false,
          message: 'UserId et status sont requis'
        });
      }

      const subscription = await subscriptionService.getSubscription(userId);
      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Abonnement non trouvé'
        });
      }

      await subscriptionService.updateSubscriptionStatus(subscription.id, status);
      const updatedSubscription = await subscriptionService.getSubscription(userId);

      logger.info(`Statut de l'abonnement mis à jour pour l'utilisateur ${userId}`);

      res.json({
        success: true,
        data: updatedSubscription
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut de l\'abonnement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du statut de l\'abonnement'
      });
    }
  },

  async initiatePayment(req: Request, res: Response) {
    try {
      const { userId, subscriptionType } = req.body;

      if (!userId || !subscriptionType) {
        return res.status(400).json({ 
          success: false,
          message: 'UserId et type d\'abonnement sont requis' 
        });
      }

      if (!VALID_SUBSCRIPTION_TYPES.includes(subscriptionType)) {
        return res.status(400).json({ 
          success: false,
          message: `Type d'abonnement invalide. Types disponibles : ${VALID_SUBSCRIPTION_TYPES.join(', ')}` 
        });
      }

      const paymentInitiation = await subscriptionService.initiatePayment(userId, subscriptionType as SubscriptionType);

      res.status(200).json({
        success: true,
        data: paymentInitiation
      });
    } catch (error) {
      logger.error('Erreur lors de l\'initiation du paiement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'initiation du paiement'
      });
    }
  },

  async handlePaymentCallback(req: Request, res: Response) {
    try {
      const {
        type_event,
        custom_field,
        ref_command,
        payment_method,
        api_key_sha256,
        api_secret_sha256,
        payment_id,
        amount,
        transaction_id
      } = req.body;

      const my_api_key = process.env.PAYTECH_API_KEY;
      const my_api_secret = process.env.PAYTECH_API_SECRET;
      const crypto = require('crypto');

      const isValidRequest = 
        crypto.createHash('sha256').update(my_api_secret).digest('hex') === api_secret_sha256 &&
        crypto.createHash('sha256').update(my_api_key).digest('hex') === api_key_sha256;

      if (!isValidRequest) {
        logger.error('Tentative de callback invalide détectée');
        return res.status(403).json({ success: false, message: 'Requête non autorisée' });
      }

      const customData = JSON.parse(custom_field);

      const callbackData: PayTechCallbackData = {
        paymentId: payment_id,
        amount: amount,
        status: type_event === 'SUCCESS_PAYMENT' ? 'completed' : 'failed',
        customField: custom_field,
        transactionId: transaction_id
      };

      await subscriptionService.handlePaymentCallback(callbackData);

      res.status(200).json({
        success: true,
        message: 'Callback traité avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors du traitement du callback:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du traitement du callback'
      });
    }
  },

  async getPaymentHistory(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'UserId est requis'
        });
      }

      const history = await subscriptionService.getPaymentHistory(userId);

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'historique des paiements:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'historique des paiements'
      });
    }
  },

  async checkRenewalEligibility(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const subscription = await subscriptionService.getSubscription(userId);
      
      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Aucun abonnement trouvé'
        });
      }

      const endDate = new Date(subscription.endDate);
      const now = new Date();
      const daysUntilExpiration = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      res.json({
        success: true,
        data: {
          canRenew: daysUntilExpiration <= 7,
          daysUntilExpiration,
          currentSubscription: subscription
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification de l\'éligibilité au renouvellement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de l\'éligibilité'
      });
    }
  },

  async checkSubscriptionStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'UserId est requis'
        });
      }

      const isActive = await subscriptionService.checkSubscriptionStatus(userId);

      res.json({
        success: true,
        data: {
          isActive
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification du statut de l\'abonnement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification du statut de l\'abonnement'
      });
    }
  }
}; 