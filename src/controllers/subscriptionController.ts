// import { Request, Response } from 'express';
type Request = any;
type Response = any;
import { CinetPayService } from '../services/cinetpayService';
import { logger } from '../utils/logger';
import { SubscriptionService } from '../services/subscriptionService';

const SUBSCRIPTION_PRICES = {
  etudiant: 1000,
  annonceur: 5000,
  recruteur: 9000
};

// Étendre l'interface Request pour inclure l'utilisateur
// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: {
//       id: string;
//       [key: string]: any;
//     };
//   }
// }

export const subscriptionController = {
  async initiatePayment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Utilisateur non authentifié'
        });
      }

      const { type, customer_name, customer_surname, customer_email, customer_phone_number } = req.body;

      if (!type || !SUBSCRIPTION_PRICES[type]) {
        return res.status(400).json({
          success: false,
          error: 'Type d\'abonnement invalide'
        });
      }

      const amount = SUBSCRIPTION_PRICES[type];
      const metadata = JSON.stringify({
        userId,
        subscriptionType: type,
        timestamp: Date.now()
      });

      const paymentResponse = await CinetPayService.initiatePayment({
        amount,
        currency: 'XOF',
        description: `Abonnement ${type} - BusinessConnect`,
        customer_name,
        customer_surname,
        customer_email,
        customer_phone_number,
        channels: 'ALL',
        metadata
      });

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.error);
      }

      logger.info('Paiement initié:', {
        userId,
        type,
        amount
      });

      res.json({
        success: true,
        data: paymentResponse.data
      });
    } catch (error) {
      logger.error('Erreur lors de l\'initiation du paiement:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'initiation du paiement'
      });
    }
  },

  async verifyPayment(req: Request, res: Response) {
    try {
      const { transaction_id } = req.body;

      if (!transaction_id) {
        return res.status(400).json({
          success: false,
          error: 'ID de transaction manquant'
        });
      }

      const verificationResponse = await CinetPayService.verifyPayment(transaction_id);

      if (!verificationResponse.success) {
        throw new Error(verificationResponse.error);
      }

      res.json({
        success: true,
        data: verificationResponse.data
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification du paiement:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la vérification du paiement'
      });
    }
  },

  async getCurrentSubscription(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      const subscriptionService = new SubscriptionService();
      const subscription = await subscriptionService.getCurrentSubscription(userId);
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'abonnement' });
    }
  }
}; 