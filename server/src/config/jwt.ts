import { Secret, SignOptions } from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

// Vérification de la présence de JWT_SECRET
if (!process.env.JWT_SECRET) {
  const message = 'JWT_SECRET is not defined in environment variables';
  logger.error(message);
  throw new Error(message);
}

const jwtConfig = {
  secret: process.env.JWT_SECRET as Secret,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as SignOptions
} as const;

export default jwtConfig; 