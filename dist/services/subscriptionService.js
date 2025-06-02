"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const User_1 = require("../models/User");
const appError_1 = require("../utils/appError");
const logger_1 = require("../utils/logger");
const paymentService_1 = require("./paymentService");
const cinetpayService_1 = require("./cinetpayService");
class SubscriptionService {
    constructor() {
        this.SUBSCRIPTION_PRICES = {
            etudiant: 1000, // 1,000 FCFA / mois
            annonceur: 5000, // 5,000 FCFA / mois
            recruteur: 9000 // 9,000 FCFA / mois
        };
        this.SUBSCRIPTION_DURATION = 30; // 30 jours pour tous les types
        this.paymentService = new paymentService_1.PaymentService();
        this.cinetPayService = new cinetpayService_1.CinetPayService();
    }
    async initiateSubscription(data) {
        try {
            const user = await User_1.User.findById(data.userId);
            if (!user) {
                throw new appError_1.AppError('Utilisateur non trouvé', 404);
            }
            if (user.role === 'admin') {
                throw new appError_1.AppError('Les administrateurs n\'ont pas besoin d\'abonnement', 400);
            }
            const amount = this.SUBSCRIPTION_PRICES[data.type];
            const paymentData = {
                amount,
                customer_name: data.customer_name,
                customer_surname: data.customer_surname,
                customer_email: data.customer_email,
                customer_phone_number: data.customer_phone_number,
                description: `Abonnement ${data.type} BusinessConnect - 30 jours`
            };
            const payment = await this.cinetPayService.createPayment({
                amount: paymentData.amount,
                currency: 'XOF',
                description: paymentData.description,
                return_url: `${process.env.FRONTEND_URL}/subscription/confirm`,
                cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
                trans_id: `SUB_${Date.now()}_${data.userId}`,
                customer_name: `${data.customer_name} ${data.customer_surname}`,
                customer_email: data.customer_email
            });
            if (!payment.success) {
                throw new appError_1.AppError('Échec de l\'initialisation du paiement', 400);
            }
            logger_1.logger.info('Paiement initié:', {
                userId: data.userId,
                type: data.type,
                amount,
                paymentUrl: payment.payment_url
            });
            return {
                paymentUrl: payment.payment_url
            };
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'initiation de l\'abonnement:', error);
            throw error;
        }
    }
    async activateSubscription(userId, type, paymentId) {
        try {
            const user = await User_1.User.findById(userId);
            if (!user) {
                throw new appError_1.AppError('Utilisateur non trouvé', 404);
            }
            if (user.role === 'admin') {
                throw new appError_1.AppError('Les administrateurs n\'ont pas besoin d\'abonnement', 400);
            }
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + this.SUBSCRIPTION_DURATION);
            const subscription = {
                type,
                status: 'active',
                startDate,
                endDate,
                paymentId
            };
            user.subscription = subscription;
            await user.save();
            logger_1.logger.info('Abonnement activé:', {
                userId,
                type,
                startDate,
                endDate,
                paymentId
            });
            return {
                success: true,
                subscription
            };
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'activation de l\'abonnement:', error);
            throw error;
        }
    }
    async checkSubscriptionStatus(userId) {
        try {
            const user = await User_1.User.findById(userId);
            if (!user) {
                throw new appError_1.AppError('Utilisateur non trouvé', 404);
            }
            // Les admins ont toujours accès
            if (user.role === 'admin') {
                return {
                    isActive: true,
                    type: 'admin',
                    message: 'Accès administrateur illimité'
                };
            }
            if (!user.subscription) {
                return {
                    isActive: false,
                    message: 'Aucun abonnement trouvé'
                };
            }
            const now = new Date();
            const isExpired = user.subscription.endDate < now;
            if (isExpired) {
                user.subscription.status = 'expired';
                await user.save();
                return {
                    isActive: false,
                    message: 'Abonnement expiré',
                    expiryDate: user.subscription.endDate
                };
            }
            return {
                isActive: true,
                type: user.subscription.type,
                expiryDate: user.subscription.endDate,
                daysRemaining: Math.ceil((user.subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            };
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la vérification du statut de l\'abonnement:', error);
            throw error;
        }
    }
}
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscriptionService.js.map