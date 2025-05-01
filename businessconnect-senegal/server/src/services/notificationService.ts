import { logger } from '../utils/logger';
import { InAppNotificationService } from './inAppNotificationService';
import nodemailer from 'nodemailer';
import { User } from '../models/user';
import { config } from '../config';

export type NotificationType = 'subscription_expiration' | 'new_offer' | 'system' | 'payment_success' | 'payment_failure';

export interface NotificationConfig {
  daysBeforeExpiration: number[];  // Par exemple [7, 3, 1] pour notifier 7, 3 et 1 jours avant
}

export class NotificationService {
  private config: NotificationConfig = {
    daysBeforeExpiration: [7, 3, 1]  // Configuration par défaut
  };
  public inAppNotificationService: InAppNotificationService;
  private transporter: nodemailer.Transporter;

  constructor(config?: NotificationConfig) {
    if (config) {
      this.config = config;
    }
    this.inAppNotificationService = new InAppNotificationService();
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

  async sendPaymentSuccessNotification(userId: string): Promise<void> {
    try {
      const title = 'Paiement réussi';
      const message = 'Votre paiement a été traité avec succès. Votre abonnement est maintenant actif.';
      await this.inAppNotificationService.createNotification(
        userId,
        'payment_success',
        title,
        message,
        { action: 'subscription_activated' }
      );
      logger.info('Notification de succès de paiement envoyée', { userId });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification de succès de paiement', { userId, error });
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

      await this.transporter.sendMail({
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

        await this.transporter.sendMail({
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

        await this.transporter.sendMail({
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

      await this.transporter.sendMail({
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

  async sendPaymentSuccessNotification(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.email) return;

      await this.transporter.sendMail({
        from: config.SMTP_FROM,
        to: user.email,
        subject: 'Paiement réussi',
        html: `
          <h2>Paiement confirmé</h2>
          <p>Votre paiement a été traité avec succès.</p>
          <p>Votre abonnement est maintenant actif.</p>
        `
      });

      logger.info(`Notification de paiement réussi envoyée à ${user.email}`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification de paiement réussi:', error);
    }
  }

  async sendPaymentFailureNotification(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.email) return;

      await this.transporter.sendMail({
        from: config.SMTP_FROM,
        to: user.email,
        subject: 'Échec du paiement',
        html: `
          <h2>Problème de paiement</h2>
          <p>Votre paiement n'a pas pu être traité.</p>
          <p>Veuillez réessayer ou contacter le support.</p>
        `
      });

      logger.info(`Notification d'échec de paiement envoyée à ${user.email}`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification d\'échec de paiement:', error);
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${config.CLIENT_URL}/verify-email/${token}`;
    
    try {
      await this.transporter.sendMail({
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
      await this.transporter.sendMail({
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
      await this.transporter.sendMail({
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
      await this.transporter.sendMail({
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
} 