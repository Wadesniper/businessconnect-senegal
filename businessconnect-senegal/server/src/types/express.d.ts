import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';
import { IUser } from './user';

declare global {
  namespace Express {
    interface Request extends ExpressRequest {
      user?: IUser;
    }
    interface Response extends ExpressResponse {}
    interface NextFunction extends ExpressNextFunction {}
  }
} 