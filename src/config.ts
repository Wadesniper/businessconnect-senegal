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
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  // Configuration SMTP
  EMAIL_HOST: process.env.SMTP_HOST,
  EMAIL_PORT: process.env.SMTP_PORT,
  EMAIL_SECURE: process.env.SMTP_SECURE === 'true',
  EMAIL_USER: process.env.SMTP_USER,
  EMAIL_PASS: process.env.SMTP_PASSWORD,
  EMAIL_FROM: process.env.SMTP_FROM,
  // Configuration CinetPay
  CINETPAY_APIKEY: process.env.CINETPAY_APIKEY,
  CINETPAY_SITE_ID: process.env.CINETPAY_SITE_ID,
  CINETPAY_SECRET_KEY: process.env.CINETPAY_SECRET_KEY
}; 