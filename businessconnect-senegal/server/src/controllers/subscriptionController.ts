import { Request, Response } from 'express';
import { AuthRequest } from '../types/user';
import { SubscriptionType, SubscriptionStatus, Subscription } from '../types/subscription';
import { subscriptionService } from '../services/subscriptionService';
import { logger } from '../utils/logger';
import { PayTechConfig } from '../config/paytech';
import { PayTech } from '../services/paytechService';
import { NotificationService } from '../services/notificationService';
import { config } from '../config';
import { User } from '../models/User';

const PLAN_PRICES = {
  'etudiant': 1000,    // 1,000 FCFA / mois
  'annonceur': 5000,   // 5,000 FCFA / mois
  'recruteur': 9000    // 9,000 FCFA / mois
};

const VALID_SUBSCRIPTION_TYPES: SubscriptionType[] = ['etudiant', 'annonceur', 'recruteur'];

export const subscriptionController = {
  async createSubscription(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const { type } = req.body as { type: SubscriptionType };
      
      const subscription = await subscriptionService.createSubscription({
        userId,
        type,
        status: 'pending'
      });
      
      logger.info('Abonnement créé avec succès', { userId, type });
      return res.status(201).json(subscription);
    } catch (error) {
      logger.error('Erreur lors de la création de l\'abonnement:', error);
      return res.status(500).json({ error: 'Erreur lors de la création de l\'abonnement' });
    }
  },

  async updateSubscriptionStatus(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const { status } = req.body as { status: SubscriptionStatus };

      const updatedSubscription = await subscriptionService.updateSubscriptionStatus(userId, status);
      
      logger.info('Statut de l\'abonnement mis à jour', { userId, status });
      return res.json(updatedSubscription);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut:', error);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
  },

  async getSubscriptionPrice(req: Request, res: Response) {
    try {
      const { type } = req.params;
      if (!type || !['etudiant', 'annonceur', 'recruteur'].includes(type)) {
        return res.status(400).json({ error: 'Type d\'abonnement invalide' });
      }
      
      const price = PLAN_PRICES[type as SubscriptionType];
      return res.json({ price });
    } catch (error) {
      logger.error('Erreur lors de la récupération du prix:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération du prix' });
    }
  },

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
  },

  async getAllSubscriptions(_req: Request, res: Response) {
    try {
      const subscriptions = await subscriptionService.getAllSubscriptions();
      return res.json(subscriptions);
    } catch (error) {
      logger.error('Erreur lors de la récupération des abonnements:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des abonnements' });
    }
  },

  async checkSubscriptionStatus(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const isActive = await subscriptionService.checkSubscriptionStatus(userId);
      const subscription = await subscriptionService.getSubscription(userId);

      return res.json({
        isActive,
        subscription
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification du statut:', error);
      return res.status(500).json({ error: 'Erreur lors de la vérification du statut' });
    }
  },

  async initiatePayment(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const { type } = req.body as { type: SubscriptionType };
      if (!type) {
        return res.status(400).json({ error: 'Type d\'abonnement requis' });
      }

      const paymentInitiation = await subscriptionService.initiatePayment(userId, type);
      
      logger.info('Paiement initié avec succès', { userId, type });
      return res.status(200).json(paymentInitiation);
    } catch (error) {
      logger.error('Erreur lors de l\'initiation du paiement:', error);
      return res.status(500).json({ error: 'Erreur lors de l\'initiation du paiement' });
    }
  },

  async handlePaymentCallback(req: Request, res: Response) {
    try {
      const callbackData = req.body;
      await subscriptionService.handlePaymentCallback(callbackData);
      
      return res.json({ success: true });
    } catch (error) {
      logger.error('Erreur lors du traitement du callback:', error);
      return res.status(500).json({ error: 'Erreur lors du traitement du callback' });
    }
  },

  async getPaymentHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const history = await subscriptionService.getPaymentHistory(userId);
      return res.json(history);
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'historique:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
  },

  async checkRenewalEligibility(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

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

  async getActiveSubscription(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const subscription = await subscriptionService.getActiveSubscription(userId);
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
  },

  getSubscriptionPlans: async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        data: {
          plans: PLAN_PRICES,
          features: {
            etudiant: [
              'Accès aux formations en ligne',
              'Générateur de CV',
              'Forum communautaire'
            ],
            annonceur: [
              'Tous les avantages Étudiant',
              'Publication d\'annonces sur le marketplace',
              'Statistiques de vente'
            ],
            recruteur: [
              'Tous les avantages Annonceur',
              'Publication d\'offres d\'emploi',
              'Accès à la CVthèque',
              'Matching automatique CV/offres'
            ]
          }
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des plans:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des plans'
      });
    }
  },

  getCurrentSubscription: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId).select('+subscription');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        data: user.subscription || null
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'abonnement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'abonnement'
      });
    }
  },

  subscribe: async (req: Request, res: Response) => {
    try {
      const { plan, duration } = req.body;
      const userId = req.user?.id;

      const amount = PLAN_PRICES[plan];
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

      res.json({
        success: true,
        data: paymentSession
      });
    } catch (error) {
      logger.error('Erreur lors de la souscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la souscription'
      });
    }
  },

  cancelSubscription: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId);

      if (!user || !user.subscription) {
        return res.status(404).json({
          success: false,
          message: 'Abonnement non trouvé'
        });
      }

      user.subscription.status = 'cancelled';
      await user.save();

      res.json({
        success: true,
        message: 'Abonnement annulé avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de l\'annulation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'annulation'
      });
    }
  },

  renewSubscription: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId);

      if (!user || !user.subscription) {
        return res.status(404).json({
          success: false,
          message: 'Abonnement non trouvé'
        });
      }

      // Créer une nouvelle session de paiement pour le renouvellement
      const paymentSession = await this.paytech.createPaymentSession({
        amount: PLAN_PRICES[user.subscription.plan],
        description: `Renouvellement abonnement ${user.subscription.plan}`,
        customerId: userId,
        customerEmail: user.email,
        metadata: {
          plan: user.subscription.plan,
          duration: user.subscription.duration,
          userId,
          isRenewal: true
        }
      });

      res.json({
        success: true,
        data: paymentSession
      });
    } catch (error) {
      logger.error('Erreur lors du renouvellement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du renouvellement'
      });
    }
  },

  handlePayTechWebhook: async (req: Request, res: Response) => {
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
      const { userId, plan, duration, isRenewal } = metadata;

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
          plan,
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

      res.json({ success: true });
    } catch (error) {
      logger.error('Erreur lors du traitement du webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du traitement du webhook'
      });
    }
  }
}; 