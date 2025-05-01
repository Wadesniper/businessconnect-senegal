import { Request, Response } from 'express';
import { AuthRequest } from '../types/user';
import { SubscriptionType, Subscription, getSubscriptionDetails } from '../config/subscription';
import { PayTechConfig } from '../config/paytech';
import { logger } from '../utils/logger';

export const subscriptionController = {
  async getSubscriptionPlans(req: Request, res: Response) {
    try {
      const plans = ['etudiant', 'annonceur', 'recruteur'].map((type) => 
        getSubscriptionDetails(type as SubscriptionType)
      );
      
      res.json({ success: true, data: plans });
    } catch (error) {
      logger.error('Erreur lors de la récupération des plans:', error);
      res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
  },

  async initiatePayment(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          error: 'Utilisateur non authentifié' 
        });
      }

      const { type } = req.body;
      if (!type || !['etudiant', 'annonceur', 'recruteur'].includes(type)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Type d\'abonnement invalide' 
        });
      }

      const subscription = getSubscriptionDetails(type as SubscriptionType);
      
      const paymentData = {
        amount: subscription.price,
        description: `Abonnement ${type} - BusinessConnect`,
        customField: JSON.stringify({
          userId,
          subscriptionType: type,
          timestamp: Date.now()
        })
      };

      const paymentResponse = await PayTechConfig.initiatePayment(paymentData);
      
      logger.info('Paiement initié:', { 
        userId, 
        type, 
        amount: subscription.price 
      });

      res.json({
        success: true,
        data: {
          redirectUrl: paymentResponse.redirectUrl,
          paymentId: paymentResponse.paymentId,
          amount: subscription.price,
          type: subscription.type,
          features: subscription.features
        }
      });
    } catch (error) {
      logger.error('Erreur lors de l\'initiation du paiement:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de l\'initiation du paiement' 
      });
    }
  }
}; 