"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const subscriptionService_1 = require("../services/subscriptionService");
class WebhookController {
    constructor() {
        this.handlePaymentWebhook = async (req, res) => {
            try {
                const { type, data } = req.body;
                if (type === 'payment.success') {
                    // Ici, implémenter la vérification du paiement CinetPay selon la documentation officielle
                    // Exemple : const paymentVerification = await cinetpayService.verifyPayment(data.paymentId);
                    // if (paymentVerification.status === 'completed') { ... }
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
            }
            catch (error) {
                console.error('Erreur webhook:', error);
                res.status(500).json({ error: 'Erreur lors du traitement du webhook' });
            }
        };
        this.subscriptionService = new subscriptionService_1.SubscriptionService();
    }
}
exports.WebhookController = WebhookController;
