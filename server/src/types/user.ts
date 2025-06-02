import { Document } from 'mongoose';

export type UserRole = 'admin' | 'etudiant' | 'annonceur' | 'employeur';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: 'active' | 'inactive';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationToken?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  phoneNumber: string;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    language: string;
  };
  notifications?: Array<{
    _id: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }>;
}

export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export { AuthRequest } from './express'; 