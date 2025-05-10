import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../../.env') });

export interface Config {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CLIENT_URL: string;
  API_URL: string;
  MONGODB_URI: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  SMTP_FROM: string;
  CINETPAY_APIKEY: string;
  CINETPAY_SITE_ID: string;
  CINETPAY_SECRET_KEY: string;
}

// Validation des variables d'environnement requises
const requiredEnvVars = [
  'JWT_SECRET',
  'MONGODB_URI',
  'CINETPAY_APIKEY',
  'CINETPAY_SITE_ID',
  'CINETPAY_SECRET_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`La variable d'environnement ${envVar} est requise`);
  }
}

// Helper function pour gérer les variables d'environnement undefined
const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`La variable d'environnement ${name} est requise`);
  }
  return value || defaultValue || '';
};

export const config: Config = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '5000'), 10),
  DATABASE_URL: process.env.MONGODB_URI as string,
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '7d'),
  CLIENT_URL: getEnvVar('CLIENT_URL', 'https://app.businessconnectsenegal.com'),
  API_URL: getEnvVar('API_URL', 'https://api.businessconnectsenegal.com'),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/businessconnect',
  SMTP_HOST: getEnvVar('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: parseInt(getEnvVar('SMTP_PORT', '465'), 10),
  SMTP_USER: getEnvVar('SMTP_USER', ''),
  SMTP_PASSWORD: getEnvVar('SMTP_PASSWORD', ''),
  SMTP_FROM: getEnvVar('SMTP_FROM', 'noreply@businessconnect.sn'),
  CINETPAY_APIKEY: getEnvVar('CINETPAY_APIKEY'),
  CINETPAY_SITE_ID: getEnvVar('CINETPAY_SITE_ID'),
  CINETPAY_SECRET_KEY: getEnvVar('CINETPAY_SECRET_KEY')
}; 