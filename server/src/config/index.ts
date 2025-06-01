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
  CINETPAY_BASE_URL: string;
  CINETPAY_NOTIFY_URL: string;
  CINETPAY_RETURN_URL: string;
}

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || '',

  // Configuration JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fc5c01210b133afeb2c293bfd28c59df3bb9d3b272999be0eb838c930b1419fd',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Configuration SMTP
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || '',

  // URLs de l'application
  CLIENT_URL: process.env.CLIENT_URL || 'https://businessconnectsenegal2025gooo.vercel.app',
  API_URL: process.env.API_URL || 'https://businessconnect-senegal-api-production.up.railway.app',

  CINETPAY_APIKEY: process.env.CINETPAY_APIKEY || '',
  CINETPAY_SITE_ID: process.env.CINETPAY_SITE_ID || '',
  CINETPAY_BASE_URL: process.env.CINETPAY_BASE_URL || 'https://api-checkout.cinetpay.com/v2/payment',
  CINETPAY_NOTIFY_URL: process.env.CINETPAY_NOTIFY_URL || `${process.env.API_URL || 'https://businessconnect-senegal-api-production.up.railway.app'}/api/subscriptions/notify`,
  CINETPAY_RETURN_URL: process.env.CINETPAY_RETURN_URL || `${process.env.CLIENT_URL || 'https://businessconnectsenegal2025gooo.vercel.app'}/payment/return`
}; 