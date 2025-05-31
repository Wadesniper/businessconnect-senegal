import { Request } from 'express';

export type UserRole = 'user' | 'admin' | 'recruiter';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: UserRole;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPayload {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
} 