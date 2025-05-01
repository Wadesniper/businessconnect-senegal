"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const mongoose_1 = require("mongoose");
const paymentService_1 = require("./paymentService");
const subscription_1 = require("../models/subscription");
const user_1 = require("../models/user");
class SubscriptionService {
    constructor() {
        this.paymentService = new paymentService_1.PaymentService();
    }
    async createSubscription(userId, type, autoRenew = false) {
        const user = await user_1.User.findById(userId);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + (type === 'premium' ? 12 : 1));
        const subscription = await subscription_1.Subscription.create({
            userId: new mongoose_1.Types.ObjectId(userId),
            type,
            status: 'active',
            startDate,
            endDate,
            autoRenew
        });
        return subscription.toObject();
    }
    async getSubscription(userId) {
        const subscription = await subscription_1.Subscription.findOne({
            userId: new mongoose_1.Types.ObjectId(userId),
            status: 'active'
        }).lean();
        return subscription;
    }
    async cancelSubscription(subscriptionId) {
        const subscription = await subscription_1.Subscription.findByIdAndUpdate(subscriptionId, { status: 'cancelled', autoRenew: false }, { new: true }).lean();
        return subscription;
    }
    async renewSubscription(subscriptionId) {
        const subscription = await subscription_1.Subscription.findById(subscriptionId);
        if (!subscription)
            return null;
        const newEndDate = new Date(subscription.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + (subscription.type === 'premium' ? 12 : 1));
        const updatedSubscription = await subscription_1.Subscription.findByIdAndUpdate(subscriptionId, {
            status: 'active',
            endDate: newEndDate,
            $inc: { renewalCount: 1 }
        }, { new: true }).lean();
        return updatedSubscription;
    }
    async checkSubscriptionStatus(userId) {
        const subscription = await this.getSubscription(userId);
        if (!subscription)
            return false;
        const now = new Date();
        return subscription.status === 'active' && subscription.endDate > now;
    }
    async processSubscriptionPayment(userId, subscriptionType) {
        try {
            const amount = subscriptionType === 'premium' ? 50000 : 5000;
            const paymentIntent = await this.paymentService.createPayment({
                amount,
                currency: 'XOF',
                description: `Abonnement ${subscriptionType} BusinessConnect`,
                metadata: {
                    userId,
                    subscriptionType
                }
            });
            return {
                success: true,
                paymentUrl: paymentIntent.paymentUrl
            };
        }
        catch (error) {
            console.error('Erreur lors du traitement du paiement:', error);
            return { success: false };
        }
    }
}
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscriptionService.js.map