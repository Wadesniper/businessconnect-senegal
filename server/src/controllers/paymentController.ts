import { Request, Response } from '../types/custom.express';
import { logger } from '../utils/logger';
import { cinetpayService } from '../services/cinetpayService';
import { emailService } from '../services/emailService';
import { AuthRequest } from '../types/custom.express';

class PaymentController {
  async createPayment(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentification requise' });
      }
      const { amount, description } = req.body;

      const payment = await cinetpayService.createPayment({
        amount,
        description,
        userId: req.user.id
      });

      res.json(payment);
    } catch (error) {
      logger.error('Erreur lors de la création du paiement:', error);
      res.status(500).json({
        error: 'Une erreur est survenue lors de la création du paiement'
      });
    }
  }

  async confirmPayment(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentification requise' });
      }
      const { token } = req.body;

      const payment = await cinetpayService.confirmPayment(token);

      if (payment.status === 'success') {
        // S'assurer que req.user.email existe si UserPayload le rend optionnel
        if (!req.user.email) {
            logger.warn('Email utilisateur non disponible pour la notification de paiement réussi.');
        } else {
            await emailService.sendPaymentSuccessEmail(req.user.email, {
              amount: payment.amount,
              currency: payment.currency,
              payment_intent_id: payment.id
            });
        }
      }

      res.json(payment);
    } catch (error) {
      logger.error('Erreur lors de la confirmation du paiement:', error);
      res.status(500).json({
        error: 'Une erreur est survenue lors de la confirmation du paiement'
      });
    }
  }

  async getPaymentHistory(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentification requise' });
      }
      const payments = await cinetpayService.getPaymentHistory(req.user.id);
      res.json(payments);
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'historique des paiements:', error);
      res.status(500).json({
        error: 'Une erreur est survenue lors de la récupération de l\'historique'
      });
    }
  }

  async getPaymentDetails(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentification requise' });
      }
      const { paymentId } = req.params;
      const payment = await cinetpayService.getPaymentDetails(paymentId);

      if (!payment) {
        return res.status(404).json({ error: 'Paiement non trouvé' });
      }

      // Vérifier que l'utilisateur a le droit d'accéder à ce paiement
      if (payment.userId !== req.user.id) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      res.json(payment);
    } catch (error) {
      logger.error('Erreur lors de la récupération des détails du paiement:', error);
      res.status(500).json({
        error: 'Une erreur est survenue lors de la récupération des détails'
      });
    }
  }
}

export const paymentController = new PaymentController(); 