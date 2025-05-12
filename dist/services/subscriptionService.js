"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const subscription_1 = require("../models/subscription");
class SubscriptionService {
    async getCurrentSubscription(userId) {
        try {
            const subscription = await subscription_1.Subscription.findOne({
                userId,
                endDate: { $gt: new Date() }
            }).sort({ endDate: -1 });
            return subscription;
        }
        catch (error) {
            throw new Error('Erreur lors de la récupération de l\'abonnement');
        }
    }
}
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscriptionService.js.map