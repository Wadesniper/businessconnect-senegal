import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SubscriptionType, SubscriptionStatus, Subscription } from '../types/subscription';
import { subscriptionService } from '../services/subscriptionService';
import { logger } from '../utils/logger';
import { PayTechConfig } from '../config/paytech';

const SUBSCRIPTION_PRICES = {
  etudiant: 1000,    // 1,000 FCFA / mois
  annonceur: 5000,   // 5,000 FCFA / mois
  recruteur: 9000    // 9,000 FCFA / mois
};

const VALID_SUBSCRIPTION_TYPES: SubscriptionType[] = ['etudiant', 'annonceur', 'recruteur'];

export class SubscriptionController {
  async createSubscription(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const { type } = req.body as { type: SubscriptionType };
      
      const subscription = await subscriptionService.createSubscription(userId, type);
      
      logger.info('Abonnement créé avec succès', { userId, type });
      return res.status(201).json(subscription);
    } catch (error) {
      logger.error('Erreur lors de la création de l\'abonnement:', error);
      return res.status(500).json({ error: 'Erreur lors de la création de l\'abonnement' });
    }
  }

  async updateSubscriptionStatus(req: AuthRequest, res: Response) {
    try {
      const { subscriptionId } = req.params;
      const { status } = req.body as { status: SubscriptionStatus };

      const updatedSubscription = await subscriptionService.updateSubscriptionStatus(subscriptionId, status);
      
      logger.info('Statut de l\'abonnement mis à jour', { subscriptionId, status });
      return res.json(updatedSubscription);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut:', error);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
  }

  async getSubscriptionPrice(req: Request, res: Response) {
    try {
      const { type } = req.params;
      if (!type || !['etudiant', 'annonceur', 'recruteur'].includes(type)) {
        return res.status(400).json({ error: 'Type d\'abonnement invalide' });
      }
      
      const price = await subscriptionService.getPrice(type as SubscriptionType);
      return res.json({ price });
    } catch (error) {
      logger.error('Erreur lors de la récupération du prix:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération du prix' });
    }
  }

  async getSubscription(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const subscription = await subscriptionService.getSubscription(userId);
      return res.json(subscription);
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération de l\'abonnement' });
    }
  }

  async getAllSubscriptions(_req: Request, res: Response) {
    try {
      const subscriptions = await subscriptionService.getAllSubscriptions();
      return res.json(subscriptions);
    } catch (error) {
      logger.error('Erreur lors de la récupération des abonnements:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des abonnements' });
    }
  }

  async checkSubscriptionStatus(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const isActive = await subscriptionService.checkSubscriptionStatus(userId);
      return res.json({ isActive });
    } catch (error) {
      logger.error('Erreur lors de la vérification du statut:', error);
      return res.status(500).json({ error: 'Erreur lors de la vérification du statut' });
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
          message: `Type d'abonnement invalide. Types disponibles : etudiant (${SUBSCRIPTION_PRICES.etudiant} FCFA), annonceur (${SUBSCRIPTION_PRICES.annonceur} FCFA), recruteur (${SUBSCRIPTION_PRICES.recruteur} FCFA)` 
        });
      }

      const amount = SUBSCRIPTION_PRICES[subscriptionType];
      
      // Préparer les données pour PayTech
      const paymentData = {
        item_name: `Abonnement ${subscriptionType} BusinessConnect`,
        item_price: amount.toString(),
        currency: "XOF",
        ref_command: `SUB-${userId}-${Date.now()}`,
        command_name: `Abonnement ${subscriptionType} BusinessConnect Senegal`,
        env: process.env.NODE_ENV === 'production' ? 'prod' : 'test',
        custom_field: JSON.stringify({
          userId,
          subscriptionType,
          timestamp: Date.now()
        })
      };

      // Initier le paiement avec PayTech
      const paymentResponse = await PayTechConfig.initiatePayment(paymentData);
      logger.info('Paiement initié avec PayTech', { userId, subscriptionType, amount });

      // Créer un abonnement en attente
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

      // Vérifier que la requête vient bien de PayTech
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
        // Mettre à jour le statut de l'abonnement
        await subscriptionService.updateSubscriptionStatus(userId, 'active');
        logger.info(`Paiement réussi pour l'utilisateur ${userId}`);

        res.json({
          success: true,
          message: 'Paiement traité avec succès'
        });
      } else {
        // En cas d'échec, marquer l'abonnement comme expiré
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
  }
}

export const subscriptionController = new SubscriptionController(); 