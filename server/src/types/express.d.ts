import { IUser } from '../models/User';
import express, { Request as ExpressRequest, Response, NextFunction, Router, RequestHandler as ExpressRequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    message: string;
    field?: string;
  }>;
}

export interface Request extends ExpressRequest {
  user?: IUser;
  file?: Express.Multer.File;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
  params: ParamsDictionary;
  body: any;
  query: ParsedQs;
  path: string;
  headers: Record<string, string | string[] | undefined>;
  header(name: string): string | undefined;
}

export interface UserPayload {
  id: string;
  role: 'user' | 'admin' | 'recruiter';
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  isVerified: boolean;
}

export interface AuthRequest extends Request {
  user: UserPayload;
}

export interface TypedRequest<T = any> extends Request {
  body: T;
}

export interface TypedResponse<T = any> extends Response {
  json: (body: ApiResponse<T>) => TypedResponse<T>;
  status: (code: number) => TypedResponse<T>;
}

export interface TypedRequestHandler<T = any, R = any> extends ExpressRequestHandler {
  (req: TypedRequest<T>, res: TypedResponse<R>, next: NextFunction): Promise<void> | void;
}

export interface RequestHandler extends ExpressRequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<void> | void;
}

export interface RouteHandler extends ExpressRequestHandler {
  (req: Request, res: Response): Promise<void> | void;
}

export interface AuthRouteHandler extends ExpressRequestHandler {
  (req: AuthRequest, res: Response): Promise<void> | void;
}

export interface AuthRequestHandler extends ExpressRequestHandler {
  (req: AuthRequest, res: Response, next: NextFunction): Promise<void> | void;
}

export interface Controller {
  handleError(error: Error, res: Response): void;
  validateRequest(req: Request): ApiResponse | null;
}

export { Response, NextFunction, Router, express as default }; 