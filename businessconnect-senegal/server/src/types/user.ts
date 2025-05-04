import { Request } from 'express';
import { Document } from 'mongoose';
import { BaseDocument } from './global';
import { SubscriptionType } from './subscription';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  EMPLOYER = 'employer',
  MODERATOR = 'moderator'
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  subscription?: {
    type: SubscriptionType;
    expiresAt: Date;
  };
  profile?: {
    avatar?: string;
    phone?: string;
    address?: string;
    bio?: string;
    skills?: string[];
    company?: string;
    position?: string;
  };
  lastLogin: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = IUser & Document;

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface UserCreateData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  phoneNumber?: string;
  profile?: {
    phone?: string;
    address?: string;
    company?: string;
    position?: string;
  };
}

export interface UserUpdateData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: UserRole;
  isVerified?: boolean;
}

export interface UserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  isVerified: boolean;
  subscription?: {
    type: SubscriptionType;
    expiresAt: Date;
  };
  lastLogin: Date;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  token: string;
  user: UserResponse;
}

export interface UserPasswordResetRequest {
  email: string;
}

export interface UserPasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserTokenPayload extends UserPayload {
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
} 