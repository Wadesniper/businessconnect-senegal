import { JWTConfig } from '../types/jwt';

const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '24h'
};

export default jwtConfig; 