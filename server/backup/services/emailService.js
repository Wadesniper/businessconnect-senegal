"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: config_1.config.SMTP_HOST,
            port: config_1.config.SMTP_PORT,
            secure: config_1.config.SMTP_SECURE,
            auth: {
                user: config_1.config.SMTP_USER,
                pass: config_1.config.SMTP_PASSWORD
            }
        });
    }
    async sendEmail(options) {
        try {
            await this.transporter.sendMail({
                from: `"BusinessConnect Sénégal" <${config_1.config.SMTP_FROM}>`,
                ...options
            });
            logger_1.logger.info(`Email envoyé à ${options.to}`);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'envoi de l\'email:', error);
            throw new Error('Erreur lors de l\'envoi de l\'email');
        }
    }
    // Templates d'emails
    async sendPaymentSuccessEmail(to, data) {
        const html = `
      <h1>Paiement réussi</h1>
      <p>Votre paiement de ${data.amount} ${data.currency} a été traité avec succès.</p>
      <p>Référence de transaction : ${data.payment_intent_id}</p>
      <p>Date : ${new Date().toLocaleDateString('fr-FR')}</p>
      <p>Merci de votre confiance !</p>
    `;
        await this.sendEmail({
            to,
            subject: 'Confirmation de paiement - BusinessConnect Sénégal',
            html
        });
    }
    async sendPaymentFailureEmail(to, data) {
        const html = `
      <h1>Échec du paiement</h1>
      <p>Votre paiement de ${data.amount} ${data.currency} n'a pas pu être traité.</p>
      <p>Raison : ${data.error.message}</p>
      <p>Veuillez vérifier vos informations de paiement et réessayer.</p>
      <p>Si le problème persiste, contactez notre support.</p>
    `;
        await this.sendEmail({
            to,
            subject: 'Échec du paiement - BusinessConnect Sénégal',
            html
        });
    }
    async sendSubscriptionCreatedEmail(to, data) {
        const html = `
      <h1>Abonnement activé</h1>
      <p>Votre abonnement a été activé avec succès.</p>
      <p>Plan : ${data.plan_name}</p>
      <p>Date de début : ${new Date(data.current_period_start).toLocaleDateString('fr-FR')}</p>
      <p>Date de fin : ${new Date(data.current_period_end).toLocaleDateString('fr-FR')}</p>
      <p>Merci de votre confiance !</p>
    `;
        await this.sendEmail({
            to,
            subject: 'Confirmation d\'abonnement - BusinessConnect Sénégal',
            html
        });
    }
    async sendSubscriptionCancelledEmail(to, data) {
        const html = `
      <h1>Abonnement annulé</h1>
      <p>Votre abonnement a été annulé.</p>
      <p>Vous aurez accès aux services jusqu'au ${new Date(data.current_period_end).toLocaleDateString('fr-FR')}.</p>
      <p>Nous espérons vous revoir bientôt !</p>
    `;
        await this.sendEmail({
            to,
            subject: 'Annulation d\'abonnement - BusinessConnect Sénégal',
            html
        });
    }
    async sendInvoiceEmail(to, data, pdfBuffer) {
        const html = `
      <h1>Votre facture</h1>
      <p>Veuillez trouver ci-joint votre facture pour la période du ${new Date(data.period_start).toLocaleDateString('fr-FR')} au ${new Date(data.period_end).toLocaleDateString('fr-FR')}.</p>
      <p>Montant : ${data.amount} ${data.currency}</p>
      <p>Merci de votre confiance !</p>
    `;
        await this.sendEmail({
            to,
            subject: 'Facture - BusinessConnect Sénégal',
            html,
            attachments: [
                {
                    filename: `facture-${data.invoice_id}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        });
    }
}
exports.emailService = new EmailService();
