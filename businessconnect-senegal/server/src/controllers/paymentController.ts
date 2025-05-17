import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { query } from '../config/database';
import { pdfService } from '../services/pdfService';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../types/user';
import { subscriptionService } from '../services/subscriptionService';

export const paymentController = {
  async createSetupIntent(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      if (!user) {
        res.status(401).json({ status: 'error', message: 'Utilisateur non authentifié' });
        return;
      }
      
      // TODO: Implémentation de la création d'un intent de configuration
      res.json({ setupIntent: 'TODO' });
    } catch (error) {
      logger.error('Error creating setup intent:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la configuration du paiement' });
    }
  },

  async getPaymentMethods(_: Request, res: Response) {
    try {
      // TODO: Implémenter la récupération des méthodes de paiement
      res.json({ payment_methods: [] });
    } catch (error) {
      logger.error('Error fetching payment methods:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération des méthodes de paiement' });
    }
  },

  async deletePaymentMethod(_: Request, res: Response) {
    try {
      // TODO: Implémenter la suppression de la méthode de paiement
      res.json({ success: true });
    } catch (error) {
      logger.error('Error deleting payment method:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression de la méthode de paiement' });
    }
  },

  async processPayment(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      if (!user) {
        res.status(401).json({ status: 'error', message: 'Utilisateur non authentifié' });
        return;
      }

      // TODO: Utiliser req.body pour la logique CinetPay
      res.json({ paymentIntent: 'TODO' });
      return;
    } catch (error) {
      logger.error('Error processing payment:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors du traitement du paiement' });
      return;
    }
  },

  async createSubscription(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      if (!user) {
        res.status(401).json({ status: 'error', message: 'Utilisateur non authentifié' });
        return;
      }

      const { type, customer_name, customer_surname, customer_email, customer_phone_number } = req.body;
      if (!type || !customer_name || !customer_surname || !customer_email || !customer_phone_number) {
        res.status(400).json({ status: 'error', message: 'Informations incomplètes pour l\'abonnement' });
        return;
      }

      const { redirectUrl, paymentId } = await subscriptionService.initiatePayment({
        type,
        customer_name,
        customer_surname,
        customer_email,
        customer_phone_number,
        userId: user.id
      });
      res.json({ success: true, data: { payment_url: redirectUrl, paymentId } });
      return;
    } catch (error) {
      logger.error('Error creating subscription:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la création de l\'abonnement' });
      return;
    }
  },

  async cancelSubscription(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      if (!user) {
        res.status(401).json({ status: 'error', message: 'Utilisateur non authentifié' });
        return;
      }

      // TODO: Utiliser req.body pour la logique CinetPay
      res.json({ success: true });
      return;
    } catch (error) {
      logger.error('Error canceling subscription:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de l\'annulation de l\'abonnement' });
      return;
    }
  },

  async refundPayment(_: Request, res: Response) {
    try {
      // TODO: Utiliser req.body pour la logique CinetPay
      res.json({ refund: 'TODO' });
      return;
    } catch (error) {
      logger.error('Error processing refund:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors du remboursement' });
      return;
    }
  },

  async getInvoices(_: Request, res: Response) {
    try {
      // TODO: Implémenter la récupération des factures
      res.json({ invoices: [] });
      return;
    } catch (error) {
      logger.error('Error fetching invoices:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération des factures' });
      return;
    }
  },

  async getInvoice(_: Request, res: Response) {
    try {
      // TODO: Implémenter la récupération d'une facture spécifique
      res.json({ invoice: null });
      return;
    } catch (error) {
      logger.error('Error fetching invoice:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération de la facture' });
      return;
    }
  },

  async downloadInvoice(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      // Vérifier que l'utilisateur a accès à cette facture
      const invoice = await query(`
        SELECT * FROM invoices WHERE id = $1 AND user_id = $2
      `, [id, userId]);

      if (invoice.rows.length === 0) {
        throw new AppError('Facture non trouvée', 404);
      }

      const filePath = await pdfService.getInvoicePath(invoice.rows[0].invoice_id);
      if (!filePath) {
        throw new AppError('Fichier de facture non trouvé', 404);
      }

      res.download(filePath);
    } catch (error) {
      logger.error('Erreur lors du téléchargement de la facture:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Erreur lors du téléchargement de la facture'
        });
      }
    }
  },

  async handleWebhook(req: Request, res: Response) {
    try {
      // CinetPay envoie généralement les données en JSON (parfois en x-www-form-urlencoded)
      const body = req.body;
      // Adapter selon la structure réelle de CinetPay
      const { type, data, paymentId, status, ref_command } = body;

      // Cas 1 : format type/data (exemple du WebhookController)
      if (type === 'payment.success' && data && data.paymentId) {
        // Extraire l'userId si tu l'as mis dans ref_command lors de l'initiation
        const [, , userId] = data.ref_command ? data.ref_command.split('-') : [];
        if (userId) {
          await subscriptionService.updateSubscription(userId, {
            status: 'active',
            paymentId: data.paymentId,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
          });
        }
      }
      // Cas 2 : format direct (exemple CinetPay officiel)
      else if (status === 'ACCEPTED' && paymentId && ref_command) {
        const [, , userId] = ref_command.split('-');
        if (userId) {
          await subscriptionService.updateSubscription(userId, {
            status: 'active',
            paymentId,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
        }
      }
      // Tu peux ajouter d'autres cas selon la structure reçue

      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Erreur lors du traitement du webhook:', error);
      res.status(500).json({ error: 'Erreur lors du traitement du webhook' });
    }
  }
}; 