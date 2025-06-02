import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Vérifier si les variables essentielles sont définies
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI manquant dans le fichier .env à:', envPath);
  process.exit(1);
}

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/businessconnect',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  // Configuration SMTP
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || '587',
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@businessconnect.sn',
  // Configuration CinetPay
  CINETPAY_APIKEY: process.env.CINETPAY_APIKEY || '',
  CINETPAY_SITE_ID: process.env.CINETPAY_SITE_ID || '',
  CINETPAY_SECRET_KEY: process.env.CINETPAY_SECRET_KEY,
  CINETPAY_BASE_URL: process.env.CINETPAY_BASE_URL || 'https://api.cinetpay.com/v1',
  CINETPAY_NOTIFY_URL: process.env.CINETPAY_NOTIFY_URL || 'https://businessconnect-senegal-production.up.railway.app/api/payments/notify',
  CINETPAY_RETURN_URL: process.env.CINETPAY_RETURN_URL || 'https://businessconnect-senegal.vercel.app/payment/return',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://businessconnect-senegal.vercel.app'
}; 