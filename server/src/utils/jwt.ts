import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserPayload } from '../types/user';

export const generateToken = (payload: UserPayload, expiresIn: string = config.JWT_EXPIRES_IN): string => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, config.JWT_SECRET) as UserPayload;
}; 