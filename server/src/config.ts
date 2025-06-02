import dotenv from 'dotenv';

dotenv.config();

interface Config {
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CINETPAY_APIKEY: string;
  CINETPAY_SITE_ID: string;
  CINETPAY_BASE_URL: string;
  CINETPAY_NOTIFY_URL: string;
  CINETPAY_RETURN_URL: string;
  GOOGLE_CLOUD_PROJECT_ID: string;
  GOOGLE_CLOUD_CLIENT_EMAIL: string;
  GOOGLE_CLOUD_PRIVATE_KEY: string;
  GOOGLE_CLOUD_STORAGE_BUCKET: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  SMTP_FROM: string;
  CLIENT_URL: string;
}

export const config: Config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/businessconnect',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  CINETPAY_APIKEY: process.env.CINETPAY_APIKEY || '',
  CINETPAY_SITE_ID: process.env.CINETPAY_SITE_ID || '',
  CINETPAY_BASE_URL: process.env.CINETPAY_BASE_URL || 'https://api-checkout.cinetpay.com/v2/payment',
  CINETPAY_NOTIFY_URL: process.env.CINETPAY_NOTIFY_URL || 'https://businessconnect.sn/api/subscriptions/notify',
  CINETPAY_RETURN_URL: process.env.CINETPAY_RETURN_URL || 'https://businessconnect.sn/subscription/complete',
  GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
  GOOGLE_CLOUD_CLIENT_EMAIL: process.env.GOOGLE_CLOUD_CLIENT_EMAIL || '',
  GOOGLE_CLOUD_PRIVATE_KEY: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  GOOGLE_CLOUD_STORAGE_BUCKET: process.env.GOOGLE_CLOUD_STORAGE_BUCKET || '',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@businessconnect.sn',
  CLIENT_URL: process.env.CLIENT_URL || 'https://businessconnect.sn'
}; 