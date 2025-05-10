import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST || 'smtp-relay.brevo.com',
  port: config.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: config.SMTP_USER || '88ccee002@smtp-brevo.com',
    pass: config.SMTP_PASSWORD || 'your-smtp-password'
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const verificationUrl = `${config.CLIENT_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: config.SMTP_FROM,
      to: email,
      subject: 'Vérification de votre compte BusinessConnect',
      html: `
        <h1>Bienvenue sur BusinessConnect Sénégal !</h1>
        <p>Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #1890ff; color: white; text-decoration: none; border-radius: 5px;">
          Vérifier mon email
        </a>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous n'avez pas créé de compte sur BusinessConnect, vous pouvez ignorer cet email.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email de vérification envoyé à ${email}`);
  } catch (error) {
    logger.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email de vérification');
  }
};

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '88ccee002@smtp-brevo.com',
        pass: process.env.SMTP_PASS || 'your-smtp-password'
      }
    });

    const mailOptions = {
      ...options,
      from: process.env.SMTP_FROM || '88ccee002@smtp-brevo.com'
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email envoyé à ${options.to}`);
  } catch (error) {
    logger.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Échec de l\'envoi de l\'email');
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const resetUrl = `${config.CLIENT_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: config.SMTP_FROM || '88ccee002@smtp-brevo.com',
      to: email,
      subject: 'Réinitialisation de votre mot de passe - BusinessConnect',
      html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour procéder :</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #1890ff; color: white; text-decoration: none; border-radius: 5px;">
          Réinitialiser mon mot de passe
        </a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
        <p>L'équipe BusinessConnect Sénégal</p>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email de réinitialisation envoyé à ${email}`);
  } catch (error) {
    logger.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
  }
}; 