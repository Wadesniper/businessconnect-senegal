import nodemailer from 'nodemailer';
import { config } from '../config';
import { IUser } from '../models/User';
import { logger } from '../utils/logger';

export class NotificationService {
  private static transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: config.SMTP_SECURE,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASSWORD
    }
  });

  static async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.SMTP_FROM,
        to,
        subject,
        html
      });
      logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email:', error);
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }
  }

  static async sendWelcomeEmail(user: IUser): Promise<void> {
    const subject = 'Bienvenue sur BusinessConnect Sénégal';
    const html = `
      <h1>Bienvenue ${user.firstName} !</h1>
      <p>Nous sommes ravis de vous accueillir sur BusinessConnect Sénégal.</p>
      <p>Vous pouvez maintenant accéder à tous nos services.</p>
    `;
    await this.sendEmail(user.email, subject, html);
  }

  static async sendPasswordResetEmail(user: IUser, resetToken: string): Promise<void> {
    const subject = 'Réinitialisation de votre mot de passe';
    const resetUrl = `${config.FRONTEND_URL}/reset-password/${resetToken}`;
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

  static async sendSubscriptionConfirmation(user: IUser, subscriptionType: string): Promise<void> {
    const html = `
      <h1>Confirmation d'abonnement</h1>
      <p>Cher(e) ${user.firstName},</p>
      <p>Votre abonnement ${subscriptionType} a été activé avec succès.</p>
    `;

    await this.sendEmail(user.email, 'Confirmation d\'abonnement', html);
  }
} 