"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionService = exports.SubscriptionService = void 0;
const uuid_1 = require("uuid");
const logger_1 = require("../utils/logger");
const subscription_1 = require("../models/subscription");
class SubscriptionService {
    constructor() {
        // Prix des abonnements en FCFA
        this.SUBSCRIPTION_PRICES = {
            etudiant: 1000, // 1,000 FCFA / mois
            annonceur: 5000, // 5,000 FCFA / mois
            recruteur: 9000 // 9,000 FCFA / mois
        };
    }
    getSubscriptionPrice(type) {
        return this.SUBSCRIPTION_PRICES[type];
    }
    async initiatePayment(params) {
        try {
            const existingSubscription = await this.getActiveSubscription(params.userId);
            if (existingSubscription) {
                throw new Error('Utilisateur a déjà un abonnement actif');
            }
            const amount = this.getSubscriptionPrice(params.type);
            if (!amount) {
                throw new Error('Type d\'abonnement invalide');
            }
            const transaction_id = (0, uuid_1.v4)();
            // ... logique paiement (inchangée, dépend de cinetpayService)
            return {
                redirectUrl: '',
                paymentId: transaction_id
            };
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'initiation du paiement CinetPay:', error);
            throw error;
        }
    }
    async handlePaymentCallback(paymentData) {
        const subscription = await this.getSubscriptionByPaymentId(paymentData.paymentId);
        if (!subscription) {
            throw new Error('Souscription non trouvée');
        }
        // Adapter la logique callback CinetPay ici
        // if (paymentData.status === 'ACCEPTED') { ... }
    }
    async updateSubscriptionStatus(subscriptionId, status) {
        return subscription_1.Subscription.findByIdAndUpdate(subscriptionId, { status, updatedAt: new Date() }, { new: true }).lean();
    }
    async getSubscription(userId) {
        return subscription_1.Subscription.findOne({ userId }).sort({ createdAt: -1 }).lean();
    }
    async checkSubscriptionAccess(userId, userRole) {
        if (userRole === 'admin')
            return true;
        const sub = await this.getActiveSubscription(userId);
        return !!sub;
    }
    async getPaymentHistory(userId) {
        return subscription_1.Subscription.find({ userId }).sort({ createdAt: -1 }).lean();
    }
    async getAllSubscriptions() {
        return subscription_1.Subscription.find().sort({ createdAt: -1 }).lean();
    }
    async getActiveSubscription(userId) {
        return subscription_1.Subscription.findOne({ userId, status: 'active', endDate: { $gt: new Date() } }).sort({ createdAt: -1 }).lean();
    }
    async getSubscriptionByPaymentId(paymentId) {
        return subscription_1.Subscription.findOne({ paymentId }).lean();
    }
    async createSubscription(userId, plan) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        const subscription = new subscription_1.Subscription({
            userId,
            plan: String(plan),
            status: 'pending',
            startDate,
            endDate
        });
        await subscription.save();
        return subscription;
    }
    async updateSubscription(userId, data) {
        const last = await subscription_1.Subscription.findOne({ userId }).sort({ createdAt: -1 });
        if (!last)
            return null;
        if (data.status)
            last.status = data.status;
        if (data.paymentId)
            last.paymentId = data.paymentId;
        if (data.expiresAt)
            last.endDate = data.expiresAt;
        last.updatedAt = new Date();
        await last.save();
        return last;
    }
    async cancelSubscription(subscriptionId) {
        await this.updateSubscriptionStatus(subscriptionId, 'expired');
    }
}
exports.SubscriptionService = SubscriptionService;
exports.subscriptionService = new SubscriptionService();
