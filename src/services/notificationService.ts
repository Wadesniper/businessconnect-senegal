import { logger } from '../utils/logger';
import { InAppNotificationService } from './inAppNotificationService';
import nodemailer from 'nodemailer';
import { User } from '../models/user';
import { config } from '../config';

export type NotificationType = 
  | 'subscription_expiration' 
  | 'subscription_activated'
  | 'subscription_cancelled'
  | 'subscription_failed'
  | 'payment_success' 
  | 'payment_failure'
  | 'system';

interface NotificationConfig {
  daysBeforeExpiration: number[];
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
    daysBeforeExpiration: [7, 3, 1]
  };
  public inAppNotificationService: InAppNotificationService;

  constructor(config?: NotificationConfig) {
    if (config) {
      this.config = config;
    }
    this.inAppNotificationService = new InAppNotificationService();
  }

  private calculateDaysUntilExpiration(endDate: Date): number {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async sendSubscriptionActivatedEmail(userId: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user?.email) return;

      await this.sendEmail(
        user.email,
        'Abonnement activé - BusinessConnect Sénégal',
        `
          <h1>Votre abonnement est actif</h1>
          <p>Votre abonnement a été activé avec succès.</p>
          <p>Vous pouvez maintenant profiter de tous les avantages de votre abonnement.</p>
          <p>Merci de votre confiance !</p>
        `
      );

      await this.inAppNotificationService.createNotification(
        userId,
        'subscription_activated',
        'Abonnement activé',
        'Votre abonnement a été activé avec succès.',
        { action: 'view_subscription' }
      );
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification d\'activation:', error);
    }
  }

  async sendSubscriptionCancelledEmail(userId: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user?.email) return;

      await this.sendEmail(
        user.email,
        'Abonnement annulé - BusinessConnect Sénégal',
        `
          <h1>Votre abonnement a été annulé</h1>
          <p>Votre abonnement a été annulé avec succès.</p>
          <p>Nous espérons vous revoir bientôt !</p>
        `
      );

      await this.inAppNotificationService.createNotification(
        userId,
        'subscription_cancelled',
        'Abonnement annulé',
        'Votre abonnement a été annulé avec succès.',
        { action: 'resubscribe' }
      );
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification d\'annulation:', error);
    }
  }

  async sendSubscriptionFailedEmail(userId: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user?.email) return;

      await this.sendEmail(
        user.email,
        'Échec de l\'abonnement - BusinessConnect Sénégal',
        `
          <h1>Problème avec votre abonnement</h1>
          <p>Nous n'avons pas pu activer votre abonnement.</p>
          <p>Veuillez vérifier vos informations de paiement et réessayer.</p>
          <p>Si le problème persiste, contactez notre support.</p>
        `
      );

      await this.inAppNotificationService.createNotification(
        userId,
        'subscription_failed',
        'Échec de l\'abonnement',
        'Nous n\'avons pas pu activer votre abonnement. Veuillez réessayer.',
        { action: 'retry_subscription' }
      );
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification d\'échec:', error);
    }
  }

  // ... autres méthodes existantes ...

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
} 