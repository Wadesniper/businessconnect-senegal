"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionController = void 0;
const subscription_1 = require("../config/subscription");
const logger_1 = require("../utils/logger");
exports.subscriptionController = {
    async getSubscriptionPlans(req, res) {
        try {
            const plans = ['etudiant', 'annonceur', 'recruteur'].map((type) => (0, subscription_1.getSubscriptionDetails)(type));
            res.json({ success: true, data: plans });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des plans:', error);
            res.status(500).json({ success: false, error: 'Erreur serveur' });
        }
    },
    async initiatePayment(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
            const subscription = (0, subscription_1.getSubscriptionDetails)(type);
            const paymentData = {
                amount: subscription.price,
                description: `Abonnement ${type} - BusinessConnect`,
                customField: JSON.stringify({
                    userId,
                    subscriptionType: type,
                    timestamp: Date.now()
                })
            };
            const paymentResponse = await paytech_1.PayTechConfig.initiatePayment(paymentData);
            logger_1.logger.info('Paiement initié:', {
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
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'initiation du paiement:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de l\'initiation du paiement'
            });
        }
    }
};
//# sourceMappingURL=subscriptionController.js.map