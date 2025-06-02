"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const logger_1 = require("./logger");
const transporter = nodemailer_1.default.createTransport({
    host: config_1.config.SMTP_HOST,
    port: parseInt(config_1.config.SMTP_PORT),
    secure: config_1.config.SMTP_SECURE,
    auth: {
        user: config_1.config.SMTP_USER,
        pass: config_1.config.SMTP_PASSWORD
    }
});
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: config_1.config.SMTP_FROM,
            to,
            subject,
            html
        };
        await transporter.sendMail(mailOptions);
        logger_1.logger.info(`Email envoyé à ${to}`);
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de l\'envoi de l\'email:', error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map