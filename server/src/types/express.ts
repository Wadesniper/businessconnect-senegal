import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction, Router as ExpressRouter } from 'express';
import { ParamsDictionary, Query, Send } from 'express-serve-static-core';
import { UserPayload } from './user';

// Extend Request with our custom properties
export interface Request extends Omit<ExpressRequest, 'body'> {
  user?: UserPayload;
  body: any;
  params: ParamsDictionary;
  query: Query;
  ip: string;
  path: string;
  method: string;
  headers: any;
}

// Extend Response with necessary methods
export interface Response extends Omit<ExpressResponse, 'json' | 'send' | 'status'> {
  json: Send<any, this>;
  send: Send<any, this>;
  status(code: number): this;
}

// Define NextFunction
export type NextFunction = ExpressNextFunction;

// Define AuthRequest with required user
export interface AuthRequest extends Omit<Request, 'user'> {
  user: UserPayload;
}

// Define route handlers
export type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
export type AuthRouteHandler = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void> | void;

// Export Router
export const Router = ExpressRouter; 