import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: parseInt(config.SMTP_PORT),
  secure: config.SMTP_SECURE,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const mailOptions = {
      from: config.SMTP_FROM,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email envoyé à ${to}`);
  } catch (error) {
    logger.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
}; 