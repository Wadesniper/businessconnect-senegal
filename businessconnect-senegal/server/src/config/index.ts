import dotenv from 'dotenv';
import path from 'path';
import { PaymentGatewayConfig } from '../types/subscription';

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../../.env') });

export interface Config {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  
  // Configuration PayTech
  PAYTECH_API_KEY: string;
  PAYTECH_API_SECRET: string;
  PAYTECH_WEBHOOK_SECRET: string;
  PAYTECH_BASE_URL: string;
  
  // Configuration SMTP
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  SMTP_FROM: string;

  // Configuration des notifications
  NOTIFICATION_CONFIG: {
    enabled: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };

  // Configuration PayTech
  PAYTECH_CONFIG: PaymentGatewayConfig;

  // URLs de l'application
  CLIENT_URL: string;
  API_URL: string;
}

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/businessconnect',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  
  // Configuration PayTech
  PAYTECH_API_KEY: process.env.PAYTECH_API_KEY || '',
  PAYTECH_API_SECRET: process.env.PAYTECH_API_SECRET || '',
  PAYTECH_WEBHOOK_SECRET: process.env.PAYTECH_WEBHOOK_SECRET || '',
  PAYTECH_BASE_URL: process.env.PAYTECH_BASE_URL || 'https://paytech.sn',

  // Configuration SMTP
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || 'contact@businessconnectsenegal.com',

  // Configuration des notifications
  NOTIFICATION_CONFIG: {
    enabled: process.env.NOTIFICATIONS_ENABLED === 'true',
    email: process.env.NOTIFICATIONS_EMAIL === 'true',
    sms: process.env.NOTIFICATIONS_SMS === 'true',
    push: process.env.NOTIFICATIONS_PUSH === 'true'
  },

  // Configuration PayTech
  PAYTECH_CONFIG: {
    apiKey: process.env.PAYTECH_API_KEY || '',
    apiSecret: process.env.PAYTECH_API_SECRET || '',
    webhookSecret: process.env.PAYTECH_WEBHOOK_SECRET || '',
    baseUrl: process.env.PAYTECH_BASE_URL || 'https://paytech.sn',
    environment: (process.env.NODE_ENV === 'production') ? 'production' : 'development'
  },

  // URLs de l'application
  CLIENT_URL: process.env.CLIENT_URL || 'https://app.businessconnectsenegal.com',
  API_URL: process.env.API_URL || 'https://api.businessconnectsenegal.com'
}; 