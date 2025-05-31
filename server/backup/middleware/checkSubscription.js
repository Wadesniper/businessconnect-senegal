"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSubscription = void 0;
const subscriptionService_1 = require("../services/subscriptionService");
const subscriptionService = new subscriptionService_1.SubscriptionService();
const checkSubscription = async (req, res, next) => {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assurez-vous que req.user est défini par votre auth middleware
        if (!userId) {
            return res.status(401).json({
                status: 'error',
                message: 'Utilisateur non authentifié',
            });
        }
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        const hasAccess = await subscriptionService.checkSubscriptionAccess(userId, userRole);
        if (!hasAccess) {
            return res.status(403).json({
                status: 'error',
                message: 'Abonnement requis pour accéder aux formations',
            });
        }
        next();
        return;
    }
    catch (error) {
        console.error('Erreur lors de la vérification de l\'abonnement:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la vérification de l\'abonnement',
        });
    }
};
exports.checkSubscription = checkSubscription;
