import { User } from './user';
import { UserPayload } from './user';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
} 