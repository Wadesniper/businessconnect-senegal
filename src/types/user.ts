import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
  subscription?: {
    status: 'active' | 'inactive' | 'expired';
    type: 'basic' | 'premium';
    startDate: Date;
    expiresAt: Date;
    autoRenew: boolean;
  };
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    _id: string;
    email: string;
    role: string;
  };
} 