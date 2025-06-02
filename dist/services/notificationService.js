"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class NotificationService {
    static async sendEmail(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: config_1.config.SMTP_FROM,
                to,
                subject,
                html
            });
            logger_1.logger.info(`Email sent successfully to ${to}`);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'envoi de l\'email:', error);
            throw new Error('Erreur lors de l\'envoi de l\'email');
        }
    }
    static async sendWelcomeEmail(user) {
        const subject = 'Bienvenue sur BusinessConnect Sénégal';
        const html = `
      <h1>Bienvenue ${user.firstName} !</h1>
      <p>Nous sommes ravis de vous accueillir sur BusinessConnect Sénégal.</p>
      <p>Vous pouvez maintenant accéder à tous nos services.</p>
    `;
        await this.sendEmail(user.email, subject, html);
    }
    static async sendPasswordResetEmail(user, resetToken) {
        const subject = 'Réinitialisation de votre mot de passe';
        const resetUrl = `${config_1.config.FRONTEND_URL}/reset-password/${resetToken}`;
        const html = `
      <h1>Réinitialisation de votre mot de passe</h1>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
      <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
      <p>Ce lien expirera dans 1 heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    `;
        await this.sendEmail(user.email, subject, html);
    }
    static async sendSubscriptionConfirmation(user, subscriptionType) {
        const html = `
      <h1>Confirmation d'abonnement</h1>
      <p>Cher(e) ${user.firstName},</p>
      <p>Votre abonnement ${subscriptionType} a été activé avec succès.</p>
    `;
        await this.sendEmail(user.email, 'Confirmation d\'abonnement', html);
    }
}
exports.NotificationService = NotificationService;
NotificationService.transporter = nodemailer_1.default.createTransport({
    host: config_1.config.SMTP_HOST,
    port: Number(config_1.config.SMTP_PORT),
    secure: config_1.config.SMTP_SECURE,
    auth: {
        user: config_1.config.SMTP_USER,
        pass: config_1.config.SMTP_PASSWORD
    }
});
//# sourceMappingURL=notificationService.js.map