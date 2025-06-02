import { Secret, JwtPayload, Algorithm } from 'jsonwebtoken';
import { StringValue } from 'ms';

export interface JWTPayload extends JwtPayload {
  id: string;
  role: string;
}

export interface JWTConfig {
  secret: Secret;
  expiresIn: string | number;
  algorithm: 'HS256';
}

export interface JWTSignOptions {
  expiresIn?: string | number;
  algorithm?: Algorithm;
}

export const defaultJWTConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '24h',
  algorithm: 'HS256'
};

export const generateToken = (
  payload: JWTPayload,
  secret: Secret,
  options: JWTSignOptions = {}
): string => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, secret, {
    ...options,
    algorithm: 'HS256'
  });
};

export const verifyToken = (token: string, secret: Secret): JWTPayload => {
  const jwt = require('jsonwebtoken');
  return jwt.verify(token, secret, {
    algorithms: ['HS256']
  }) as JWTPayload;
};

// Ajouter des types pour les options de signature
export interface SignOptions extends SignOptions {
  expiresIn?: string | number;
  algorithm?: SignOptions['algorithm'];
} 