import { Request } from 'express';

export type UserRole = 'student' | 'recruiter' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
} 