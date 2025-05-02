import dotenv from 'dotenv';

dotenv.config();

const validateConfig = () => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PAYTECH_API_KEY',
    'PAYTECH_WEBHOOK_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes : ${missingVars.join(', ')}`
    );
  }
};

// Valider la configuration en production
if (process.env.NODE_ENV === 'production') {
  validateConfig();
}

export const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/businessconnect',
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Configuration SMTP
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@businessconnect.sn',

  // Configuration PayTech
  paytech: {
    apiKey: process.env.PAYTECH_API_KEY || '',
    apiSecret: process.env.PAYTECH_API_SECRET || '',
    apiUrl: process.env.PAYTECH_API_URL || 'https://paytech.sn'
  },

  // URLs de l'application
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:5000'
}; 