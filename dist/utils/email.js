"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        host: config_1.config.SMTP_HOST,
        port: config_1.config.SMTP_PORT,
        secure: config_1.config.SMTP_SECURE,
        auth: {
            user: config_1.config.SMTP_USER,
            pass: config_1.config.SMTP_PASSWORD
        }
    });
    const mailOptions = {
        from: config_1.config.SMTP_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
    };
    await transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map