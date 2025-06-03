import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from '../config';
import { UserPayload } from '../types/user';

export const generateToken = (payload: UserPayload, expiresInInput?: string): string => {
  const jwtSecret: Secret = config.JWT_SECRET as Secret;
  const effectiveExpiresIn: string = expiresInInput ?? config.JWT_EXPIRES_IN;

  if (!jwtSecret || typeof jwtSecret !== 'string' || jwtSecret.length === 0) {
    throw new Error('JWT_SECRET n\'est pas défini, n\'est pas une chaîne, ou est vide dans la configuration.');
  }
  if (!effectiveExpiresIn || typeof effectiveExpiresIn !== 'string' || effectiveExpiresIn.length === 0) {
    throw new Error('JWT_EXPIRES_IN n\'est pas défini, n\'est pas une chaîne, ou est vide dans la configuration.');
  }

  const options: SignOptions = { expiresIn: effectiveExpiresIn as any };

  return jwt.sign(payload, jwtSecret, options);
};

export const verifyToken = (token: string): UserPayload => {
  const jwtSecret: Secret = config.JWT_SECRET as Secret;
  if (!jwtSecret || typeof jwtSecret !== 'string' || jwtSecret.length === 0) {
    throw new Error('JWT_SECRET n\'est pas défini, n\'est pas une chaîne, ou est vide dans la configuration.');
  }
  return jwt.verify(token, jwtSecret) as UserPayload;
}; 