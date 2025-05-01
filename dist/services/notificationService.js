"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const logger_1 = require("../utils/logger");
const inAppNotificationService_1 = require("./inAppNotificationService");
const nodemailer_1 = __importDefault(require("nodemailer"));
const User_1 = require("../models/User");
const config_1 = require("../config");
const email_1 = require("../utils/email");
const transporter = nodemailer_1.default.createTransport({
    host: config_1.config.SMTP_HOST,
    port: config_1.config.SMTP_PORT,
    secure: config_1.config.SMTP_SECURE,
    auth: {
        user: config_1.config.SMTP_USER,
        pass: config_1.config.SMTP_PASSWORD
    }
});
class NotificationService {
    constructor(config) {
        this.config = {
            daysBeforeExpiration: [7, 3, 1]
        };
        if (config) {
            this.config = config;
        }
        this.inAppNotificationService = new inAppNotificationService_1.InAppNotificationService();
    }
    calculateDaysUntilExpiration(endDate) {
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    async sendSubscriptionActivatedEmail(userId) {
        try {
            const user = await User_1.User.findById(userId);
            if (!(user === null || user === void 0 ? void 0 : user.email))
                return;
            await this.sendEmail(user.email, 'Abonnement activé - BusinessConnect Sénégal', `
          <h1>Votre abonnement est actif</h1>
          <p>Votre abonnement a été activé avec succès.</p>
          <p>Vous pouvez maintenant profiter de tous les avantages de votre abonnement.</p>
          <p>Merci de votre confiance !</p>
        `);
            await this.inAppNotificationService.createNotification(userId, 'subscription_activated', 'Abonnement activé', 'Votre abonnement a été activé avec succès.', { action: 'view_subscription' });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'envoi de la notification d\'activation:', error);
        }
    }
    async sendSubscriptionCancelledEmail(userId) {
        try {
            const user = await User_1.User.findById(userId);
            if (!(user === null || user === void 0 ? void 0 : user.email))
                return;
            await this.sendEmail(user.email, 'Abonnement annulé - BusinessConnect Sénégal', `
          <h1>Votre abonnement a été annulé</h1>
          <p>Votre abonnement a été annulé avec succès.</p>
          <p>Nous espérons vous revoir bientôt !</p>
        `);
            await this.inAppNotificationService.createNotification(userId, 'subscription_cancelled', 'Abonnement annulé', 'Votre abonnement a été annulé avec succès.', { action: 'resubscribe' });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'envoi de la notification d\'annulation:', error);
        }
    }
    async sendSubscriptionFailedEmail(userId) {
        try {
            const user = await User_1.User.findById(userId);
            if (!(user === null || user === void 0 ? void 0 : user.email))
                return;
            await this.sendEmail(user.email, 'Échec de l\'abonnement - BusinessConnect Sénégal', `
          <h1>Problème avec votre abonnement</h1>
          <p>Nous n'avons pas pu activer votre abonnement.</p>
          <p>Veuillez vérifier vos informations de paiement et réessayer.</p>
          <p>Si le problème persiste, contactez notre support.</p>
        `);
            await this.inAppNotificationService.createNotification(userId, 'subscription_failed', 'Échec de l\'abonnement', 'Nous n\'avons pas pu activer votre abonnement. Veuillez réessayer.', { action: 'retry_subscription' });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'envoi de la notification d\'échec:', error);
        }
    }
    async sendWelcomeEmail(userId) {
        try {
            const user = await User_1.User.findById(userId);
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            await (0, email_1.sendEmail)({
                to: user.email,
                subject: 'Bienvenue sur BusinessConnect Sénégal',
                template: 'welcome',
                context: {
                    name: user.firstName
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
            throw error;
        }
    }
    async sendPasswordResetEmail(email, resetToken) {
        try {
            const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
            await (0, email_1.sendEmail)({
                to: email,
                subject: 'Réinitialisation de votre mot de passe',
                template: 'resetPassword',
                context: {
                    resetUrl
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
            throw error;
        }
    }
    async sendSubscriptionConfirmation(userId) {
        try {
            const user = await User_1.User.findById(userId);
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            await (0, email_1.sendEmail)({
                to: user.email,
                subject: 'Confirmation de votre abonnement',
                template: 'subscriptionConfirmation',
                context: {
                    name: user.firstName
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'envoi de l\'email de confirmation d\'abonnement:', error);
            throw error;
        }
    }
    async sendEmail(to, subject, html, retries = 3) {
        let lastError;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await transporter.sendMail({
                    from: config_1.config.SMTP_FROM,
                    to,
                    subject,
                    html
                });
                return;
            }
            catch (error) {
                lastError = error;
                logger_1.logger.warn(`Tentative ${attempt}/${retries} d'envoi d'email échouée:`, error);
                if (attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
        }
        logger_1.logger.error('Échec de l\'envoi d\'email après plusieurs tentatives:', lastError);
        throw lastError;
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notificationService.js.map