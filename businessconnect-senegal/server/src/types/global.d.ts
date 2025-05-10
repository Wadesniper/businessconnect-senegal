export interface UserPayload {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'recruiter';
  isVerified: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
} 