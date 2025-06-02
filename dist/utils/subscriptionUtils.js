"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionDetails = exports.isSubscriptionActive = void 0;
const isSubscriptionActive = (user) => {
    if (!user.subscription)
        return false;
    const now = new Date();
    return (user.subscription.status === 'active' &&
        user.subscription.expiresAt > now);
};
exports.isSubscriptionActive = isSubscriptionActive;
const getSubscriptionDetails = (user) => {
    if (!user.subscription) {
        return {
            isActive: false,
            type: null,
            status: null,
            expiresAt: null,
            autoRenew: false
        };
    }
    return {
        isActive: (0, exports.isSubscriptionActive)(user),
        type: user.subscription.type,
        status: user.subscription.status,
        expiresAt: user.subscription.expiresAt,
        autoRenew: user.subscription.autoRenew
    };
};
exports.getSubscriptionDetails = getSubscriptionDetails;
//# sourceMappingURL=subscriptionUtils.js.map