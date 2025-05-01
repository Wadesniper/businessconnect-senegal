import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { SubscriptionService } from '../services/subscriptionService';

export class WebhookController {
  private paymentService: PaymentService;
  private subscriptionService: SubscriptionService;

  constructor() {
    this.paymentService = new PaymentService();
    this.subscriptionService = new SubscriptionService();
  }

  handlePaymentWebhook = async (req: Request, res: Response) => {
    try {
      const { type, data } = req.body;

      if (type === 'payment.success') {
        const paymentVerification = await this.paymentService.verifyPayment(data.paymentId);
        
        if (paymentVerification.status === 'completed') {
          // Extraire les informations de la référence de commande
          const [prefix, timestamp, userId] = data.ref_command.split('-');
          
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