import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';
import { Send } from 'express-serve-static-core';
import { UserPayload } from './user';

export interface Request extends ExpressRequest {
  user?: UserPayload;
  body: any;
  path: string;
  method: string;
  headers: any;
}

export interface Response extends ExpressResponse {
  json: Send<any, this>;
  status(code: number): this;
}

export interface NextFunction extends ExpressNextFunction {
  (error?: any): void;
}

export interface AuthRequest extends Request {
  user: UserPayload;
}

export type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
export type AuthRouteHandler = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void> | void;

export { Router } from 'express'; 