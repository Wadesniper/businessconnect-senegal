import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';
import { config } from '../config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"BusinessConnect Sénégal" <${config.SMTP_FROM}>`,
        ...options
      });
      logger.info(`Email envoyé à ${options.to}`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email:', error);
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }
  }

  // Templates d'emails
  async sendPaymentSuccessEmail(to: string, data: any): Promise<void> {
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

  async sendPaymentFailureEmail(to: string, data: any): Promise<void> {
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

  async sendSubscriptionCreatedEmail(to: string, data: any): Promise<void> {
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

  async sendSubscriptionCancelledEmail(to: string, data: any): Promise<void> {
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

  async sendInvoiceEmail(to: string, data: any, pdfBuffer: Buffer): Promise<void> {
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

export const emailService = new EmailService(); 