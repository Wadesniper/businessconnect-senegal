import { Document } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'etudiant' | 'annonceur' | 'employeur';
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'etudiant' | 'annonceur' | 'employeur';
}

export interface IUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'etudiant' | 'annonceur' | 'employeur';
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface UserPayload {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  role: 'admin' | 'etudiant' | 'annonceur' | 'employeur';
} 