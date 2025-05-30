"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscriptionService_1 = require("../services/subscriptionService");
const logger_1 = require("../utils/logger");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Initialisation des services
const subscriptionService = new subscriptionService_1.SubscriptionService();
// Récupérer l'abonnement d'un utilisateur
router.get('/:userId', auth_1.authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        const subscription = await subscriptionService.getSubscription(userId);
        if (!subscription) {
            res.status(404).json({ error: 'Abonnement non trouvé' });
            return;
        }
        res.json(subscription);
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de la récupération de l\'abonnement:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'abonnement' });
    }
});
// Vérifier le statut d'un abonnement
router.get('/:userId/status', auth_1.authenticate, async (req, res) => {
    var _a;
    try {
        const { userId } = req.params;
        // @ts-ignore
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const isActive = await subscriptionService.checkSubscriptionAccess(userId, userRole);
        res.json({ isActive });
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de la vérification du statut:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la vérification du statut' });
    }
});
// Initier un nouvel abonnement
router.post('/initiate', auth_1.authenticate, async (req, res) => {
    try {
        const { userId, subscriptionType, customer_name, customer_surname, customer_email, customer_phone_number } = req.body;
        if (!userId || !subscriptionType || !customer_name || !customer_surname || !customer_phone_number) {
            res.status(400).json({ error: 'Paramètres manquants' });
            return;
        }
        // Créer un abonnement réel en base (statut pending)
        await subscriptionService.createSubscription(userId, subscriptionType);
        // Appel au service CinetPay pour obtenir le lien de paiement
        const amount = subscriptionService['SUBSCRIPTION_PRICES'][subscriptionType];
        const cinetpayService = require('../services/cinetpayService');
        const payment = await cinetpayService.cinetpayService.initializePayment({
            amount,
            customer_name,
            customer_surname,
            customer_email,
            customer_phone_number,
            description: `Abonnement ${subscriptionType} BusinessConnect`
        });
        res.json({ paymentUrl: payment.payment_url });
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de l\'initiation de l\'abonnement:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'initiation de l\'abonnement' });
    }
});
// Callback de paiement (simulation)
router.post('/payment-callback', async (req, res) => {
    try {
        const { userId, status } = req.body;
        if (!userId || !status) {
            res.status(400).json({ error: 'Paramètres manquants' });
            return;
        }
        // Récupérer l'abonnement le plus récent
        const subscription = await subscriptionService.getSubscription(userId);
        if (!subscription) {
            res.status(404).json({ error: 'Abonnement non trouvé' });
            return;
        }
        if (status === 'success') {
            const updated = await subscriptionService.updateSubscription(userId, { status: 'active' });
            res.status(200).json({ message: 'Abonnement activé', subscription: updated });
            return;
        }
        else if (status === 'expired') {
            const updated = await subscriptionService.updateSubscription(userId, { status: 'expired' });
            res.status(200).json({ message: 'Abonnement expiré', subscription: updated });
            return;
        }
        else {
            res.status(400).json({ error: 'Statut de paiement invalide' });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
        return;
    }
});
exports.default = router;
