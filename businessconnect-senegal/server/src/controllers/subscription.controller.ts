import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { logger } from '../utils/logger';
import { PaymentData, SubscriptionType } from '../types/subscription';
import { PayTechConfig } from '../config/paytech';

const subscriptionService = new SubscriptionService();

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

      const subscription = await subscriptionService.createSubscription(userId, type as SubscriptionType);
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

      const updatedSubscription = await subscriptionService.updateSubscriptionStatus(
        userId, 
        status as 'active' | 'expired' | 'pending'
      );
      
      if (!updatedSubscription) {
        return res.status(404).json({
          success: false,
          message: 'Abonnement non trouvé'
        });
      }

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

      const amount = SUBSCRIPTION_PRICES[subscriptionType as SubscriptionType];
      
      const paymentData: PaymentData = {
        amount,
        description: `Abonnement ${subscriptionType} BusinessConnect`,
        item_name: `Abonnement ${subscriptionType}`,
        item_price: amount,
        currency: "XOF",
        ref_command: `SUB-${userId}-${Date.now()}`,
        command_name: `Abonnement ${subscriptionType} BusinessConnect Senegal`,
        customField: JSON.stringify({
          userId,
          subscriptionType,
          timestamp: Date.now()
        })
      };

      const paymentResponse = await PayTechConfig.initiatePayment(paymentData);
      logger.info('Paiement initié avec PayTech', { userId, subscriptionType, amount });

      await subscriptionService.createSubscription(userId, subscriptionType as SubscriptionType);

      res.status(200).json({
        success: true,
        data: {
          redirectUrl: paymentResponse.redirectUrl,
          paymentId: paymentResponse.paymentId
        }
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
        api_secret_sha256
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
      const { userId, subscriptionType } = customData;

      if (type_event === 'SUCCESS_PAYMENT') {
        await subscriptionService.updateSubscriptionStatus(userId, 'active');
        logger.info(`Paiement réussi pour l'utilisateur ${userId}`);

        res.json({
          success: true,
          message: 'Paiement traité avec succès'
        });
      } else {
        await subscriptionService.updateSubscriptionStatus(userId, 'expired');
        logger.warn(`Échec du paiement pour l'utilisateur ${userId}`);

        res.json({
          success: false,
          message: 'Échec du paiement'
        });
      }
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
      const history = await subscriptionService.getPaymentHistory(userId);
      
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'historique des paiements:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'historique'
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

      const isValid = await subscriptionService.checkSubscriptionStatus(userId);
      const subscription = await subscriptionService.getSubscription(userId);

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Abonnement non trouvé'
        });
      }

      res.json({
        success: true,
        data: {
          status: subscription.status,
          isValid,
          endDate: subscription.endDate
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