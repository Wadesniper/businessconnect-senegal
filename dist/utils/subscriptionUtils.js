"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSubscription = void 0;
const User_1 = require("../models/User");
const appError_1 = require("./appError");
const checkSubscription = async (userId) => {
    const user = await User_1.User.findById(userId);
    if (!user) {
        throw new appError_1.AppError('Utilisateur non trouvé', 404);
    }
    if (!user.subscription) {
        return false;
    }
    const now = new Date();
    return user.subscription.status === 'active' &&
        user.subscription.expiresAt > now;
};
exports.checkSubscription = checkSubscription;
//# sourceMappingURL=subscriptionUtils.js.map