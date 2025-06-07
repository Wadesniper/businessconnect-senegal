import { Request, Response } from '../types/custom.express.js';
import { emailService } from '../services/emailService.js';
import { logger } from '../utils/logger.js';

class ContactController {
  async sendMessage(req: Request, res: Response) {
    try {
      const { name, email, subject, message } = req.body;

      // Validation des champs
      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          error: 'Tous les champs sont requis (nom, email, sujet, message)'
        });
      }

      // Envoi de l'email
      await emailService.sendEmail({
        to: process.env.CONTACT_EMAIL || 'contact@businessconnect.sn',
        subject: `Contact - ${subject}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Sujet :</strong> ${subject}</p>
          <p><strong>Message :</strong></p>
          <p>${message}</p>
        `
      });

      res.json({ message: 'Message envoyé avec succès' });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi du message de contact:', error);
      res.status(500).json({
        error: 'Une erreur est survenue lors de l\'envoi du message'
      });
    }
  }
}

export const contactController = new ContactController(); 