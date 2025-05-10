"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionController = void 0;
const cinetpayService_1 = require("../services/cinetpayService");
const logger_1 = require("../utils/logger");
const subscriptionService_1 = require("../services/subscriptionService");
const SUBSCRIPTION_PRICES = {
    etudiant: 1000,
    annonceur: 5000,
    recruteur: 9000
};
exports.subscriptionController = {
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
            const paymentResponse = await cinetpayService_1.CinetPayService.initiatePayment({
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
            logger_1.logger.info('Paiement initié:', {
                userId,
                type,
                amount
            });
            res.json({
                success: true,
                data: paymentResponse.data
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'initiation du paiement:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de l\'initiation du paiement'
            });
        }
    },
    async verifyPayment(req, res) {
        try {
            const { transaction_id } = req.body;
            if (!transaction_id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID de transaction manquant'
                });
            }
            const verificationResponse = await cinetpayService_1.CinetPayService.verifyPayment(transaction_id);
            if (!verificationResponse.success) {
                throw new Error(verificationResponse.error);
            }
            res.json({
                success: true,
                data: verificationResponse.data
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la vérification du paiement:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la vérification du paiement'
            });
        }
    },
    async getCurrentSubscription(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Utilisateur non authentifié' });
            }
            const subscriptionService = new subscriptionService_1.SubscriptionService();
            const subscription = await subscriptionService.getCurrentSubscription(userId);
            res.json(subscription);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération de l\'abonnement' });
        }
    }
};
//# sourceMappingURL=subscriptionController.js.map