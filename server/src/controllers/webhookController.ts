import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { logger } from '../utils/logger';

export class WebhookController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  handlePaymentWebhook = async (req: Request, res: Response) => {
    try {
      logger.info('Webhook CinetPay reçu:', {
        body: req.body,
        headers: req.headers
      });

      const { cpm_trans_id, cpm_result, cpm_trans_status } = req.body;

      if (!cpm_trans_id) {
        logger.error('Webhook CinetPay - ID de transaction manquant');
        return res.status(400).json({
          success: false,
          message: 'ID de transaction manquant'
        });
      }

      // Récupérer l'abonnement associé à cette transaction
      const subscription = await this.subscriptionService.getSubscriptionByPaymentId(cpm_trans_id);

      if (!subscription) {
        logger.error(`Webhook CinetPay - Abonnement non trouvé pour la transaction ${cpm_trans_id}`);
        return res.status(404).json({
          success: false,
          message: 'Abonnement non trouvé'
        });
      }

      // Traiter le statut du paiement
      if (cpm_result === '00' && cpm_trans_status === 'ACCEPTED') {
        logger.info(`Webhook CinetPay - Paiement réussi pour la transaction ${cpm_trans_id}`);

        // Calculer la date d'expiration (30 jours)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        // Mettre à jour l'abonnement
        await this.subscriptionService.updateSubscription(subscription.userId, {
          status: 'active',
          paymentId: cpm_trans_id,
          expiresAt
        });

        return res.status(200).json({
          success: true,
          message: 'Paiement validé et abonnement activé'
        });
      } else {
        logger.warn(`Webhook CinetPay - Paiement échoué pour la transaction ${cpm_trans_id}`, {
          result: cpm_result,
          status: cpm_trans_status
        });

        // Mettre à jour l'abonnement comme échoué
        await this.subscriptionService.updateSubscription(subscription.userId, {
          status: 'failed',
          paymentId: cpm_trans_id
        });

        return res.status(200).json({
          success: true,
          message: 'Paiement échoué enregistré'
        });
      }
    } catch (error: any) {
      logger.error('Webhook CinetPay - Erreur:', {
        error: error.message,
        stack: error.stack
      });

      return res.status(500).json({
        success: false,
        message: 'Erreur lors du traitement de la notification'
      });
    }
  };
} 