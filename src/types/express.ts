import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
  Router as ExpressRouter
} from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import * as qs from 'qs'; // Import qs for query parameter typing
import { UserPayload } from './user'; // Assuming this path is correct and UserPayload is defined

// Re-declare Request to extend ExpressRequest and add 'user', preserving generics
export interface Request<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends ExpressRequest<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: UserPayload;
}

// Re-declare Response to extend ExpressResponse, preserving generics
export interface Response<
  ResBody = any,
  Locals extends Record<string, any> = Record<string, any>
> extends ExpressResponse<ResBody, Locals> {}

// Re-declare NextFunction (typically not generic or already correctly handled)
export interface NextFunction extends ExpressNextFunction {}

// AuthRequest extends our custom, generic Request
export interface AuthRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: UserPayload; // user is mandatory for AuthRequest
}

// Type for route handlers using our custom types
export type RouteHandler = (
  req: Request<any, any, any, any>, // Using 'any' for generics for simplicity here, or specify
  res: Response<any, any>,
  next: NextFunction
) => Promise<void> | void;

export type AuthRouteHandler = (
  req: AuthRequest<any, any, any, any>,
  res: Response<any, any>,
  next: NextFunction
) => Promise<void> | void;

// Export Router from Express
export const Router = ExpressRouter; 