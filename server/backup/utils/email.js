"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("./logger");
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
const sendVerificationEmail = async (email, token) => {
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
        logger_1.logger.info(`Email de vérification envoyé à ${email}`);
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
        throw new Error('Erreur lors de l\'envoi de l\'email de vérification');
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendResetPasswordEmail = async (email, token) => {
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
        logger_1.logger.info(`Email de réinitialisation envoyé à ${email}`);
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
        throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
    }
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
