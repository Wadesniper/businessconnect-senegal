import nodemailer from 'nodemailer';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BusinessConnect Senegal" <noreply@businessconnect.sn>',
      to: email,
      subject: 'Vérification de votre compte BusinessConnect',
      html: `
        <h1>Bienvenue sur BusinessConnect Senegal</h1>
        <p>Pour vérifier votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
      `
    });

    logger.info(`Email de vérification envoyé à ${email}`);
  } catch (error) {
    logger.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email de vérification');
  }
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BusinessConnect Senegal" <noreply@businessconnect.sn>',
      to: email,
      subject: 'Réinitialisation de votre mot de passe BusinessConnect',
      html: `
        <h1>Réinitialisation de votre mot de passe</h1>
        <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé de réinitialisation, vous pouvez ignorer cet email.</p>
      `
    });

    logger.info(`Email de réinitialisation envoyé à ${email}`);
  } catch (error) {
    logger.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
  }
}; 