import { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';

export interface JWTPayload extends JwtPayload {
  id: string;
  [key: string]: any;
}

export interface JWTConfig {
  secret: Secret;
  expiresIn: string | number;
}

export interface JWTSignOptions extends SignOptions {
  expiresIn?: string | number;
}

export const generateToken = (
  payload: JWTPayload,
  secret: Secret,
  options: JWTSignOptions = {}
): string => {
  const jwt = require('jsonwebtoken');
  const signOptions: SignOptions = {
    ...options,
    algorithm: 'HS256'
  };
  return jwt.sign(payload, secret, signOptions);
};

export const verifyToken = (token: string, secret: Secret): JWTPayload => {
  const jwt = require('jsonwebtoken');
  return jwt.verify(token, secret, {
    algorithms: ['HS256']
  }) as JWTPayload;
};

// Ajouter des types pour les options de signature
export interface SignOptions extends jwt.SignOptions {
  expiresIn?: string | number;
  algorithm?: jwt.Algorithm;
} 