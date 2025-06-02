import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction, Router as ExpressRouter, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { UserPayload } from './user';

export interface Request extends ExpressRequest {
  user?: UserPayload;
}

export interface Response extends ExpressResponse {}

export interface NextFunction extends ExpressNextFunction {}

export interface AuthRequest extends Request {
  user: UserPayload;
}

export type RouteHandler = RequestHandler;
export type AuthRouteHandler = RequestHandler<ParamsDictionary, any, any, any, { user: UserPayload }>;

export { ExpressRouter as Router }; 