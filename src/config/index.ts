import dotenv from 'dotenv';

dotenv.config();

const validateConfig = () => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET'
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
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/businessconnect',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  
  // SMTP Configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_SERVICE: process.env.SMTP_SERVICE || 'gmail',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@businessconnect.sn',

  // URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:5000',

  // Other configurations
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '5mb',
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
}; 