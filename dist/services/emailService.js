"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const transporter = nodemailer_1.default.createTransport({
    host: config_1.config.SMTP_HOST,
    port: config_1.config.SMTP_PORT,
    secure: config_1.config.SMTP_SECURE,
    auth: {
        user: config_1.config.SMTP_USER,
        pass: config_1.config.SMTP_PASSWORD
    }
});
const sendVerificationEmail = async (email, userId) => {
    try {
        const verificationLink = `${config_1.config.CLIENT_URL}/verify-email?token=${userId}`;
        await transporter.sendMail({
            from: config_1.config.SMTP_FROM,
            to: email,
            subject: 'Vérification de votre compte BusinessConnect',
            html: `
        <h1>Bienvenue sur BusinessConnect !</h1>
        <p>Merci de vous être inscrit. Pour vérifier votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${verificationLink}">Vérifier mon compte</a>
        <p>Si vous n'avez pas créé de compte sur BusinessConnect, vous pouvez ignorer cet email.</p>
      `
        });
        logger_1.logger.info(`Email de vérification envoyé à ${email}`);
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
        throw error;
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
//# sourceMappingURL=emailService.js.map