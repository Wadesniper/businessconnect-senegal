import jwt from 'jsonwebtoken';
import { config } from '../config';

export const generateToken = (
  payload: object,
  secret: string = config.JWT_SECRET,
  options?: jwt.SignOptions
): string => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (
  token: string,
  secret: string = config.JWT_SECRET
): any => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Token invalide');
  }
}; 