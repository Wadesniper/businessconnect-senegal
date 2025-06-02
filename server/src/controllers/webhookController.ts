import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { logger } from '../utils/logger';

interface CinetPayWebhookData {
  cpm_trans_id: string;
  cpm_site_id: string;
  cpm_trans_status: string;
  cpm_payment_date: string;
  cpm_payment_time: string;
  cpm_amount: string;
  cpm_currency: string;
  signature: string;
  payment_method: string;
}

export class WebhookController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
    this.handleCinetPayWebhook = this.handleCinetPayWebhook.bind(this);
  }

  async handleCinetPayWebhook(req: Request, res: Response) {
    try {
      const data = req.body as CinetPayWebhookData;
      const { cpm_trans_id, cpm_trans_status } = data;

      logger.info('Webhook CinetPay reçu:', data);

      // Récupérer l'abonnement associé au paiement
      const subscription = await this.subscriptionService.getSubscriptionByPaymentId(cpm_trans_id);
      if (!subscription) {
        logger.error('Aucun abonnement trouvé pour le paiement:', cpm_trans_id);
        return res.status(404).json({
          success: false,
          message: 'Abonnement non trouvé'
        });
      }

      // Traiter le statut du paiement
      if (cpm_trans_status === 'ACCEPTED') {
        // Activer l'abonnement
        await this.subscriptionService.activateSubscription(
          subscription.userId,
          subscription.type,
          cpm_trans_id
        );

        logger.info('Abonnement activé:', {
          userId: subscription.userId,
          type: subscription.type,
          paymentId: cpm_trans_id
        });

        res.json({
          success: true,
          message: 'Abonnement activé avec succès'
        });
      } else {
        // Marquer l'abonnement comme échoué
        await this.subscriptionService.updateSubscription(subscription.userId, {
          status: 'expired'
        });

        logger.warn('Paiement échoué:', {
          userId: subscription.userId,
          type: subscription.type,
          paymentId: cpm_trans_id,
          status: cpm_trans_status
        });

        res.json({
          success: false,
          message: 'Paiement échoué'
        });
      }
    } catch (error) {
      logger.error('Erreur lors du traitement du webhook CinetPay:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }
} 