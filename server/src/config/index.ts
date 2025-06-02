import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../../.env') });

export interface Config {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  
  // Configuration JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // Configuration SMTP
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  SMTP_FROM: string;

  // URLs de l'application
  CLIENT_URL: string;
  API_URL: string;

  CINETPAY_APIKEY: string;
  CINETPAY_SITE_ID: string;
  CINETPAY_SECRET_KEY: string;
  CINETPAY_BASE_URL: string;
  CINETPAY_NOTIFY_URL: string;
  CINETPAY_RETURN_URL: string;

  email: {
    user: string;
    password: string;
    from: string;
  };
}

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/businessconnect',

  // Configuration JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Configuration SMTP
  SMTP_HOST: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@businessconnect.sn',

  // URLs de l'application
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:5000',

  // Configuration CinetPay
  CINETPAY_APIKEY: process.env.CINETPAY_APIKEY || '',
  CINETPAY_SITE_ID: process.env.CINETPAY_SITE_ID || '',
  CINETPAY_SECRET_KEY: process.env.CINETPAY_SECRET_KEY || '782120606818e842c196f0.72843773',
  CINETPAY_BASE_URL: process.env.CINETPAY_BASE_URL || 'https://api-checkout.cinetpay.com/v2',
  CINETPAY_NOTIFY_URL: process.env.CINETPAY_NOTIFY_URL || 'https://api.businessconnect.sn/api/payments/webhook',
  CINETPAY_RETURN_URL: process.env.CINETPAY_RETURN_URL || 'https://businessconnect.sn/payment/confirmation',

  // Configuration email (utilisant Brevo/SMTP)
  email: {
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || 'noreply@businessconnect.sn'
  }
}; 