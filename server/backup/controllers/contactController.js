"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configuration du transporteur d'email
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
const sendContactEmail = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        // Validation des données
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont requis'
            });
        }
        // Configuration de l'email
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.CONTACT_EMAIL || 'contact@businessconnect-senegal.com',
            subject: `Contact - ${subject}`,
            html: `
        <h3>Nouveau message de contact</h3>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Sujet:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
        };
        // Envoi de l'email
        await transporter.sendMail(mailOptions);
        // Email de confirmation à l'expéditeur
        const confirmationMailOptions = {
            from: process.env.CONTACT_EMAIL || 'contact@businessconnect-senegal.com',
            to: email,
            subject: 'Confirmation de réception - BusinessConnect Sénégal',
            html: `
        <h3>Merci de nous avoir contactés</h3>
        <p>Cher(e) ${name},</p>
        <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
        <p>Notre équipe vous répondra dans les plus brefs délais.</p>
        <p>Cordialement,</p>
        <p>L'équipe BusinessConnect Sénégal</p>
      `
        };
        await transporter.sendMail(confirmationMailOptions);
        return res.status(200).json({
            success: true,
            message: 'Email envoyé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi de l\'email'
        });
    }
};
exports.sendContactEmail = sendContactEmail;
