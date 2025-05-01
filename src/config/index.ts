export const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/businessconnect',
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Configuration SMTP
  SMTP_HOST: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '88ccee002@smtp-brevo.com',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || 'myFchwr5H6AYtJdq',
  SMTP_FROM: process.env.SMTP_FROM || '88ccee002@smtp-brevo.com',

  // Configuration PayTech
  PAYTECH_API_KEY: process.env.PAYTECH_API_KEY || 'be2b2e9b3a0ed01d69d30dff8a21f05199e2e71968788b4890690d7af56ba32b',
  PAYTECH_WEBHOOK_SECRET: process.env.PAYTECH_WEBHOOK_SECRET || '6860a504cc73992c2e8dc623c7b31d948ef5a4ec2507a0a4771e62755cca9277',
  PAYTECH_BASE_URL: process.env.PAYTECH_BASE_URL || 'https://paytech.sn',

  // URLs de l'application
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:3001'
}; 