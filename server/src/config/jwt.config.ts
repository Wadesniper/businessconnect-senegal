import { Secret } from 'jsonwebtoken';

interface JWTConfig {
  secret: Secret;
  verificationSecret: Secret;
  resetSecret: Secret;
  expiresIn: string;
}

const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  verificationSecret: process.env.JWT_VERIFICATION_SECRET || 'verification-secret-key',
  resetSecret: process.env.JWT_RESET_SECRET || 'reset-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '30d'
};

export default jwtConfig; 