import jwt from 'jsonwebtoken';
import { IUser } from '../types/user';

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '24h' }
  );
}; 