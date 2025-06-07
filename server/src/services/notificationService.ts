import { logger } from '../utils/logger.js';
import { InAppNotificationService } from './inAppNotificationService.js';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
import { config } from '../config.js';

export type NotificationType = 'subscription_expiration' | 'new_offer' | 'system' | 'payment_success' | 'payment_failure';

export interface NotificationConfig {
  daysBeforeExpiration: number[];  // Par exemple [7, 3, 1] pour notifier 7, 3 et 1 jours avant
}

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_SECURE,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD
  }
});

export class NotificationService {
  private config: NotificationConfig = {
    daysBeforeExpiration: [7, 3, 1]  // Configuration par défaut
  };
  public inAppNotificationService: InAppNotificationService;

  constructor(config?: NotificationConfig) {
    if (config) {
      this.config = config;
    }
    this.inAppNotificationService = new InAppNotificationService();
  }

  async checkAndSendExpirationNotifications(subscription: {
    userId: string;
    type: string;
    endDate: Date;
    status: string;
  }): Promise<void> {
    try {
      if (subscription.status !== 'active') {
        return;
      }

      const daysUntilExpiration = this.calculateDaysUntilExpiration(subscription.endDate);
      
      if (this.config.daysBeforeExpiration.includes(daysUntilExpiration)) {
        await this.sendExpirationNotification(subscription, daysUntilExpiration);
      }
    } catch (error) {
      logger.error('Erreur lors de la vérification des notifications', {
        userId: subscription.userId,
        error
      });
    }
  }

  private calculateDaysUntilExpiration(endDate: Date): number {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private async sendExpirationNotification(
    subscription: { userId: string; type: string },
    daysRemaining: number
  ): Promise<void> {
    try {
      const title = 'Votre abonnement expire bientôt';
      const message = `Votre abonnement ${subscription.type} expirera dans ${daysRemaining} jour(s). Pour continuer à bénéficier de nos services, veuillez le renouveler.`;
      
      await this.inAppNotificationService.createNotification(
        subscription.userId,
        'subscription_expiration',
        title,
        message,
        {
          subscriptionType: subscription.type,
          daysRemaining,
          action: 'renewal'
        }
      );

      logger.info('Notification d\'expiration créée', {
        userId: subscription.userId,
        daysRemaining
      });
    } catch (error) {
      logger.error('Erreur lors de la création de la notification', {
        userId: subscription.userId,
        error
      });
    }
  }

  private async sendEmail(to: string, subject: string, html: string, retries = 3): Promise<void> {
    let lastError;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await transporter.sendMail({
          from: config.SMTP_FROM,
          to,
          subject,
          html
        });
        return;
      } catch (error) {
        lastError = error;
        logger.warn(`Tentative ${attempt}/${retries} d'envoi d'email échouée:`, error);
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    logger.error('Échec de l\'envoi d\'email après plusieurs tentatives:', lastError);
    throw lastError;
  }

  async sendPaymentSuccessNotification(userId: string): Promise<void> {
    try {
      const title = 'Paiement réussi';
      const message = 'Votre paiement a été traité avec succès. Votre abonnement est maintenant actif.';
      
      // Notification in-app
      await this.inAppNotificationService.createNotification(
        userId,
        'payment_success',
        title,
        message,
        { action: 'subscription_activated' }
      );

      // Email notification
      const user = await User.findById(userId);
      if (user?.email) {
        await this.sendEmail(
          user.email,
          'Confirmation de paiement - BusinessConnect Sénégal',
          `
            <h1>Paiement confirmé</h1>
            <p>Votre paiement a été traité avec succès.</p>
            <p>Votre abonnement est maintenant actif.</p>
            <p>Merci de votre confiance !</p>
          `
        );
      }

      logger.info('Notifications de succès de paiement envoyées', { userId });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi des notifications de succès de paiement', { userId, error });
      throw error;
    }
  }

  async sendPaymentFailureNotification(userId: string): Promise<void> {
    try {
      const title = 'Échec du paiement';
      const message = 'Votre paiement n\'a pas pu être traité. Veuillez réessayer ou contacter le support.';
      await this.inAppNotificationService.createNotification(
        userId,
        'payment_failure',
        title,
        message,
        { action: 'retry_payment' }
      );
      logger.info('Notification d\'échec de paiement envoyée', { userId });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification d\'échec de paiement', { userId, error });
    }
  }

  async sendNewPostNotification(userId: string, topicTitle: string) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.email) return;

      await transporter.sendMail({
        from: config.SMTP_FROM,
        to: user.email,
        subject: 'Nouvelle réponse à votre sujet',
        html: `
          <h2>Nouvelle réponse</h2>
          <p>Quelqu'un a répondu à votre sujet : "${topicTitle}"</p>
          <p>Connectez-vous pour voir la réponse.</p>
        `
      });

      logger.info(`Notification de nouvelle réponse envoyée à ${user.email}`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification de nouvelle réponse:', error);
    }
  }

  async sendTopicReportNotification(topicId: string) {
    try {
      const moderators = await User.find({ role: 'moderator' });
      
      for (const moderator of moderators) {
        if (!moderator.email) continue;

        await transporter.sendMail({
          from: config.SMTP_FROM,
          to: moderator.email,
          subject: 'Nouveau signalement de sujet',
          html: `
            <h2>Nouveau signalement</h2>
            <p>Un sujet a été signalé (ID: ${topicId})</p>
            <p>Veuillez vous connecter pour examiner ce signalement.</p>
          `
        });

        logger.info(`Notification de signalement de sujet envoyée à ${moderator.email}`);
      }
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification de signalement de sujet:', error);
    }
  }

  async sendPostReportNotification(postId: string) {
    try {
      const moderators = await User.find({ role: 'moderator' });
      
      for (const moderator of moderators) {
        if (!moderator.email) continue;

        await transporter.sendMail({
          from: config.SMTP_FROM,
          to: moderator.email,
          subject: 'Nouveau signalement de message',
          html: `
            <h2>Nouveau signalement</h2>
            <p>Un message a été signalé (ID: ${postId})</p>
            <p>Veuillez vous connecter pour examiner ce signalement.</p>
          `
        });

        logger.info(`Notification de signalement de message envoyée à ${moderator.email}`);
      }
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification de signalement de message:', error);
    }
  }

  async sendSubscriptionExpirationNotification(userId: string, daysLeft: number) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.email) return;

      await transporter.sendMail({
        from: config.SMTP_FROM,
        to: user.email,
        subject: 'Votre abonnement expire bientôt',
        html: `
          <h2>Rappel d'expiration</h2>
          <p>Votre abonnement expire dans ${daysLeft} jours.</p>
          <p>Connectez-vous pour le renouveler.</p>
        `
      });

      logger.info(`Notification d'expiration envoyée à ${user.email}`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification d\'expiration:', error);
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${config.CLIENT_URL}/verify-email/${token}`;
    
    try {
      await transporter.sendMail({
        from: config.SMTP_FROM,
        to: email,
        subject: 'Vérification de votre compte BusinessConnect Sénégal',
        html: `
          <h1>Bienvenue sur BusinessConnect Sénégal</h1>
          <p>Pour vérifier votre compte, veuillez cliquer sur le lien ci-dessous :</p>
          <a href="${verificationUrl}">Vérifier mon compte</a>
          <p>Ce lien expire dans 24 heures.</p>
        `
      });
      logger.info(`Email de vérification envoyé à ${email}`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
      throw new Error('Erreur lors de l\'envoi de l\'email de vérification');
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${config.CLIENT_URL}/reset-password/${token}`;
    
    try {
      await transporter.sendMail({
        from: config.SMTP_FROM,
        to: email,
        subject: 'Réinitialisation de votre mot de passe - BusinessConnect Sénégal',
        html: `
          <h1>Réinitialisation de mot de passe</h1>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
          <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
          <p>Ce lien expire dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        `
      });
      logger.info(`Email de réinitialisation envoyé à ${email}`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
    }
  }

  async sendOrderNotification(email: string, orderDetails: any): Promise<void> {
    try {
      await transporter.sendMail({
        from: config.SMTP_FROM,
        to: email,
        subject: 'Confirmation de commande - BusinessConnect Sénégal',
        html: `
          <h1>Confirmation de votre commande</h1>
          <p>Votre commande a été confirmée avec succès.</p>
          <h2>Détails de la commande :</h2>
          <p>Numéro de commande : ${orderDetails.orderId}</p>
          <p>Montant total : ${orderDetails.total} FCFA</p>
          <p>Date : ${new Date().toLocaleDateString('fr-FR')}</p>
        `
      });
      logger.info(`Email de confirmation de commande envoyé à ${email}`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email de confirmation de commande:', error);
      throw new Error('Erreur lors de l\'envoi de l\'email de confirmation');
    }
  }

  async sendNewJobApplicationNotification(employerEmail: string, jobTitle: string, applicantName: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: config.SMTP_FROM,
        to: employerEmail,
        subject: 'Nouvelle candidature - BusinessConnect Sénégal',
        html: `
          <h1>Nouvelle candidature reçue</h1>
          <p>Vous avez reçu une nouvelle candidature pour le poste : ${jobTitle}</p>
          <p>Candidat : ${applicantName}</p>
          <p>Connectez-vous à votre compte pour consulter la candidature.</p>
        `
      });
      logger.info(`Notification de candidature envoyée à ${employerEmail}`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification de candidature:', error);
      throw new Error('Erreur lors de l\'envoi de la notification');
    }
  }

  // Notification pour la création de compte
  async sendWelcomeEmail(email: string, name: string) {
    const mailOptions = {
      from: config.SMTP_FROM,
      to: email,
      subject: 'Bienvenue sur BusinessConnect Sénégal',
      html: `
        <h1>Bienvenue ${name} !</h1>
        <p>Nous sommes ravis de vous accueillir sur BusinessConnect Sénégal.</p>
      `
    };
    await transporter.sendMail(mailOptions);
  }

  // Notification pour l'abonnement
  async sendSubscriptionConfirmation(email: string, plan: string) {
    const mailOptions = {
      from: config.SMTP_FROM,
      to: email,
      subject: 'Confirmation d\'abonnement - BusinessConnect Sénégal',
      html: `
        <h1>Abonnement confirmé</h1>
        <p>Votre abonnement au plan ${plan} a été activé avec succès.</p>
      `
    };
    await transporter.sendMail(mailOptions);
  }

  // Notification pour le paiement
  async sendPaymentConfirmation(email: string, amount: number) {
    const mailOptions = {
      from: config.SMTP_FROM,
      to: email,
      subject: 'Confirmation de paiement - BusinessConnect Sénégal',
      html: `
        <h1>Paiement reçu</h1>
        <p>Nous avons bien reçu votre paiement de ${amount} FCFA.</p>
      `
    };
    await transporter.sendMail(mailOptions);
  }

  // Notification pour l'expiration d'abonnement
  async sendSubscriptionExpiration(email: string) {
    const mailOptions = {
      from: config.SMTP_FROM,
      to: email,
      subject: 'Expiration d\'abonnement - BusinessConnect Sénégal',
      html: `
        <h1>Votre abonnement expire bientôt</h1>
        <p>N'oubliez pas de renouveler votre abonnement pour continuer à profiter de nos services.</p>
      `
    };
    await transporter.sendMail(mailOptions);
  }

  // --- Stubs pour compatibilité routes notifications ---
  async getUserNotifications(_: string) {
    return [];
  }
  async getUnreadNotifications(_: string) {
    return [];
  }
  async markAsRead(_: string, __: string) {
    return { success: true };
  }
  async markAllAsRead(_: string) {
    return { success: true };
  }
  async deleteNotification(_: string, __: string) {
    return { success: true };
  }
}

export const notificationService = new NotificationService(); 