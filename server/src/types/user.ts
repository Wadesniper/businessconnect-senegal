import { Types } from 'mongoose';

export type UserRole = 'admin' | 'etudiant' | 'annonceur' | 'employeur';

export interface UserPayload {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
}

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phoneNumber: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
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

// Suppression de l'interface AuthRequest car elle est déjà dans express.ts 