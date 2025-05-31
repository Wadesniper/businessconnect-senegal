"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Charger les variables d'environnement
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
exports.config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/businessconnect',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    // Configuration SMTP
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    SMTP_SECURE: process.env.SMTP_SECURE === 'true',
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
    SMTP_FROM: process.env.SMTP_FROM || 'contact@businessconnectsenegal.com',
    // URLs de l'application
    CLIENT_URL: process.env.CLIENT_URL || 'https://app.businessconnectsenegal.com',
    API_URL: process.env.API_URL || 'https://api.businessconnectsenegal.com',
    CINETPAY_APIKEY: process.env.CINETPAY_APIKEY || '',
    CINETPAY_SITE_ID: process.env.CINETPAY_SITE_ID || '',
    CINETPAY_BASE_URL: process.env.CINETPAY_BASE_URL || 'https://api-checkout.cinetpay.com/v2/payment',
    CINETPAY_NOTIFY_URL: process.env.CINETPAY_NOTIFY_URL || '',
    CINETPAY_RETURN_URL: process.env.CINETPAY_RETURN_URL || '',
};
