import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction, Router as ExpressRouter } from 'express';
import { ParamsDictionary, Query, Send } from 'express-serve-static-core';
import { UserPayload } from './user';

// Base Request interface extending ExpressRequest
export interface Request extends ExpressRequest {
  user?: UserPayload;
  body: any;
  params: ParamsDictionary;
  query: Query;
  ip: string;
  path: string;
  method: string;
  headers: Record<string, string | string[] | undefined>;
}

// Base Response interface extending ExpressResponse
export interface Response<ResBody = any> extends ExpressResponse<ResBody> {
  json(body: ResBody): this;
  send: Send<ResBody, this>;
  status(code: number): this;
}

// Export NextFunction
export type NextFunction = ExpressNextFunction;

// Define AuthRequest with required user
export interface AuthRequest extends Request {
  user: UserPayload;
}

// Define route handlers
export type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void | Response> | void;
export type AuthRouteHandler = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void | Response> | void;

// Export Router
export type Router = ExpressRouter;
export { ExpressRouter }; 