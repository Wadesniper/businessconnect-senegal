import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';

export class WebhookController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  handlePaymentWebhook = async (req: Request, res: Response) => {
    try {
      const { type, data } = req.body;

      if (type === 'payment.success') {
        // TODO: Vérifier le paiement via CinetPay ou autre service ici
        // const paymentVerification = await ...
        // if (paymentVerification.status === 'completed') {
        if (data && data.paymentId) {
          // Extraire les informations de la référence de commande
          const [, , userId] = data.ref_command.split('-');
          // Mettre à jour l'abonnement
          await this.subscriptionService.updateSubscription(userId, {
            status: 'active',
            paymentId: data.paymentId,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
          });
        }
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Erreur webhook:', error);
      res.status(500).json({ error: 'Erreur lors du traitement du webhook' });
    }
  };
} 