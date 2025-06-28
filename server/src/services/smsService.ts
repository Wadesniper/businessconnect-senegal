import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import twilio from 'twilio';

export class SMSService {
  private apiKey: string;
  private apiSecret: string;
  private from: string;

  constructor() {
    // Pour l'instant, on utilise des variables d'environnement
    // Tu devras configurer ces variables avec ton service SMS
    this.apiKey = process.env.SMS_API_KEY || '';
    this.apiSecret = process.env.SMS_API_SECRET || '';
    this.from = process.env.SMS_FROM || 'BusinessConnect';
  }

  /**
   * Génère un code SMS de 6 chiffres
   */
  private generateSMSCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Envoie un SMS avec un code de réinitialisation
   */
  async sendResetCode(phoneNumber: string): Promise<{ code: string; success: boolean }> {
    try {
      const code = this.generateSMSCode();
      
      // Pour l'instant, on simule l'envoi SMS
      // Tu devras intégrer un vrai service SMS ici
      logger.info(`[SMS] Code de réinitialisation généré pour ${phoneNumber}: ${code}`);
      
      // Simulation d'envoi SMS (à remplacer par un vrai service)
      const success = await this.sendSMS(phoneNumber, `Votre code de réinitialisation BusinessConnect: ${code}. Valide 10 minutes.`);
      
      return { code, success };
    } catch (error) {
      logger.error('Erreur lors de l\'envoi du SMS:', error);
      return { code: '', success: false };
    }
  }

  /**
   * Méthode pour envoyer un SMS (à implémenter avec un vrai service)
   */
  private async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      );
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to
      });
      logger.info(`[SMS] Twilio envoyé vers ${to}`);
      return true;
    } catch (error) {
      logger.error('Erreur lors de l\'envoi SMS Twilio:', error);
      return false;
    }
  }

  /**
   * Vérifie si un numéro de téléphone est valide
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Validation basique pour les numéros internationaux
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }
}

export default new SMSService(); 