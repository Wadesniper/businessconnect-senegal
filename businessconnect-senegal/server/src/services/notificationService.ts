import { logger } from '../utils/logger';
import { InAppNotificationService } from './inAppNotificationService';
import nodemailer from 'nodemailer';
import { User } from '../models/user';
import { config } from '../config';
import { Notification } from '../models/notification';
import { Schema } from 'mongoose';
import { WebSocket } from 'ws';
import {
  NotificationType,
  NotificationConfig,
  NotificationOptions,
  NotificationResponse,
  NotificationCreateData,
  BulkNotificationData,
  WebSocketConnection
} from '../types/notification';

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
    daysBeforeExpiration: [7, 3, 1],
    emailRetries: 3,
    maxBulkSize: 100
  };
  public inAppNotificationService: InAppNotificationService;
  private connections: Map<string, WebSocketConnection>;
  private transporter: nodemailer.Transporter;

  constructor(config?: Partial<NotificationConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.inAppNotificationService = new InAppNotificationService();
    this.connections = new Map();
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
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
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@businessconnect.sn',
        to: user.email,
        subject: 'Paiement réussi - BusinessConnect Sénégal',
        html: `
          <h1>Paiement réussi</h1>
          <p>Cher(e) ${user.firstName},</p>
          <p>Votre paiement a été traité avec succès. Votre abonnement est maintenant actif.</p>
          <p>Type d'abonnement : ${user.subscription?.plan}</p>
          <p>Date de fin : ${new Date(user.subscription?.endDate || '').toLocaleDateString()}</p>
          <p>Merci de votre confiance !</p>
          <p>L'équipe BusinessConnect Sénégal</p>
        `
      });

      logger.info('Email de confirmation de paiement envoyé', { userId });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
      throw error;
    }
  }

  async sendPaymentFailureNotification(userId: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@businessconnect.sn',
        to: user.email,
        subject: 'Échec du paiement - BusinessConnect Sénégal',
        html: `
          <h1>Échec du paiement</h1>
          <p>Cher(e) ${user.firstName},</p>
          <p>Nous n'avons pas pu traiter votre paiement. Veuillez vérifier vos informations de paiement et réessayer.</p>
          <p>Si vous continuez à rencontrer des problèmes, n'hésitez pas à nous contacter.</p>
          <p>L'équipe BusinessConnect Sénégal</p>
        `
      });

      logger.info('Email d\'échec de paiement envoyé', { userId });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email d\'échec:', error);
      throw error;
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

  async sendSubscriptionExpirationNotification(userId: string, daysRemaining: number): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@businessconnect.sn',
        to: user.email,
        subject: 'Expiration prochaine de votre abonnement - BusinessConnect Sénégal',
        html: `
          <h1>Expiration prochaine de votre abonnement</h1>
          <p>Cher(e) ${user.firstName},</p>
          <p>Votre abonnement ${user.subscription?.plan} expire dans ${daysRemaining} jours.</p>
          <p>Pour continuer à profiter de nos services, veuillez renouveler votre abonnement.</p>
          <p>L'équipe BusinessConnect Sénégal</p>
        `
      });

      logger.info('Email d\'expiration d\'abonnement envoyé', { userId });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email d\'expiration:', error);
      throw error;
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

  async sendSubscriptionCreatedNotification(userId: string, type: string): Promise<void> {
    await this.createNotification({
      userId,
      type: 'subscription_created',
      title: 'Abonnement créé',
      message: `Votre abonnement ${type} a été créé avec succès.`,
      metadata: { subscriptionType: type }
    });
  }

  async sendSubscriptionCancelledNotification(userId: string): Promise<void> {
    await this.createNotification({
      userId,
      type: 'subscription_cancelled',
      title: 'Abonnement annulé',
      message: 'Votre abonnement a été annulé.',
      metadata: { event: 'subscription_cancelled' }
    });
  }

  async sendSubscriptionExpirationNotification(userId: string, daysLeft: number): Promise<void> {
    await this.createNotification({
      userId,
      type: 'subscription_expired',
      title: 'Expiration d\'abonnement',
      message: `Votre abonnement expire dans ${daysLeft} jours.`,
      metadata: { event: 'subscription_expiration', daysLeft }
    });
  }

  async createNotification(data: NotificationCreateData): Promise<void> {
    try {
      const notification = new Notification({
        ...data,
        user: new Schema.Types.ObjectId(data.userId)
      });

      await notification.save();
      this.sendRealTimeNotification(data.userId, notification);
    } catch (error) {
      logger.error('Erreur lors de la création de la notification:', error);
      throw error;
    }
  }

  async getNotificationById(notificationId: string): Promise<Notification | null> {
    try {
      return await Notification.findById(notificationId).lean();
    } catch (error) {
      logger.error('Erreur lors de la récupération de la notification:', error);
      throw error;
    }
  }

  async getNotificationsByUser(
    userId: string, 
    options: NotificationOptions = {}
  ): Promise<NotificationResponse> {
    try {
      const query = {
        user: new Schema.Types.ObjectId(userId),
        ...(options.isRead !== undefined && { isRead: options.isRead })
      };

      const [notifications, total, unread] = await Promise.all([
        Notification.find(query)
          .sort({ createdAt: -1 })
          .skip(options.offset || 0)
          .limit(options.limit || 10)
          .lean(),
        Notification.countDocuments(query),
        Notification.countDocuments({ user: new Schema.Types.ObjectId(userId), isRead: false })
      ]);

      return { notifications, total, unread };
    } catch (error) {
      logger.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification | null> {
    try {
      return await Notification.findOneAndUpdate(
        { _id: notificationId, user: new Schema.Types.ObjectId(userId) },
        { isRead: true },
        { new: true }
      ).lean();
    } catch (error) {
      logger.error('Erreur lors du marquage de la notification comme lue:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await Notification.updateMany(
        { user: new Schema.Types.ObjectId(userId) },
        { isRead: true }
      );
    } catch (error) {
      logger.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      const result = await Notification.deleteOne({
        _id: notificationId,
        user: new Schema.Types.ObjectId(userId)
      });
      return result.deletedCount > 0;
    } catch (error) {
      logger.error('Erreur lors de la suppression de la notification:', error);
      throw error;
    }
  }

  async deleteAllNotifications(userId: string): Promise<void> {
    try {
      await Notification.deleteMany({
        user: new Schema.Types.ObjectId(userId)
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression de toutes les notifications:', error);
      throw error;
    }
  }

  // Méthodes pour la gestion des WebSockets
  addConnection(userId: string, socket: WebSocket): void {
    this.connections.set(userId, { userId, socket });
  }

  removeConnection(userId: string): void {
    this.connections.delete(userId);
  }

  private sendRealTimeNotification(userId: string, notification: Notification): void {
    const connection = this.connections.get(userId);
    if (connection?.socket.readyState === WebSocket.OPEN) {
      connection.socket.send(JSON.stringify(notification));
    }
  }

  // Méthodes pour les notifications de masse
  async sendBulkNotifications(data: BulkNotificationData): Promise<Notification[]> {
    try {
      if (data.userIds.length > this.config.maxBulkSize) {
        throw new Error(`Le nombre maximum de destinataires est ${this.config.maxBulkSize}`);
      }

      const notifications = await Promise.all(
        data.userIds.map(userId =>
          this.createNotification({
            ...data,
            userId
          })
        )
      );

      return notifications;
    } catch (error) {
      logger.error('Erreur lors de l\'envoi des notifications en masse:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await Notification.countDocuments({
        user: new Schema.Types.ObjectId(userId),
        isRead: false
      });
    } catch (error) {
      logger.error('Erreur lors du comptage des notifications non lues:', error);
      throw error;
    }
  }

  async sendNotification(
    userId: string,
    type: NotificationType,
    data: Record<string, any>
  ): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Créer la notification in-app
      await this.createNotification({
        userId,
        type,
        title: this.getNotificationTitle(type),
        message: this.getNotificationMessage(type, data),
        data
      });

      // Envoyer l'email si activé
      if (config.NOTIFICATION_CONFIG.email) {
        await this.sendEmail(
          user.email,
          this.getNotificationTitle(type),
          this.getNotificationEmailTemplate(type, data)
        );
      }

      logger.info('Notification envoyée avec succès', { userId, type });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification:', error);
      throw error;
    }
  }

  private getNotificationTitle(type: NotificationType): string {
    const titles: Record<NotificationType, string> = {
      subscription_created: 'Nouvel abonnement créé',
      subscription_cancelled: 'Abonnement annulé',
      subscription_renewed: 'Abonnement renouvelé',
      subscription_expiration: 'Abonnement expirant bientôt',
      payment_success: 'Paiement réussi',
      payment_failure: 'Échec du paiement',
      new_post: 'Nouvelle publication',
      topic_report: 'Signalement de sujet',
      post_report: 'Signalement de message',
      new_job_application: 'Nouvelle candidature',
      order_notification: 'Mise à jour de commande'
    };
    return titles[type] || 'Notification';
  }

  private getNotificationMessage(type: NotificationType, data: Record<string, any>): string {
    switch (type) {
      case 'subscription_created':
        return `Votre abonnement ${data.type} a été créé avec succès.`;
      case 'subscription_cancelled':
        return `Votre abonnement ${data.type} a été annulé. Raison : ${data.reason}`;
      case 'subscription_renewed':
        return `Votre abonnement ${data.type} a été renouvelé jusqu'au ${new Date(data.endDate).toLocaleDateString()}.`;
      case 'subscription_expiration':
        return `Votre abonnement ${data.type} expire dans ${data.daysRemaining} jours.`;
      case 'payment_success':
        return `Votre paiement de ${data.amount} FCFA a été traité avec succès.`;
      case 'payment_failure':
        return 'Votre paiement n\'a pas pu être traité. Veuillez réessayer.';
      default:
        return 'Nouvelle notification';
    }
  }

  private getNotificationEmailTemplate(type: NotificationType, data: Record<string, any>): string {
    const message = this.getNotificationMessage(type, data);
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">${this.getNotificationTitle(type)}</h1>
        <p style="color: #666; font-size: 16px;">${message}</p>
        <p style="color: #888; font-size: 14px;">L'équipe BusinessConnect Sénégal</p>
      </div>
    `;
  }
} 