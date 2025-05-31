import { Secret, SignOptions } from 'jsonwebtoken';
import { logger } from '../utils/logger';

if (!process.env.JWT_SECRET) {
  logger.error('JWT_SECRET is not defined in environment variables. This is a security risk in production.');
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be defined in production environment');
  }
}

const jwtConfig = {
  secret: process.env.JWT_SECRET as Secret,
  signOptions: {
    expiresIn: '7d'
  } satisfies SignOptions
} as const;

export default jwtConfig; 