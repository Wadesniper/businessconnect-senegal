import {
  Request as ExpressRequestBase,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction
} from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { UserPayload } from './user';

// Grâce à express-request.d.ts, Express.Request a maintenant user?
// Notre Request peut être plus simple ou directement utiliser Express.Request
export type Request = ExpressRequestBase;

// AuthRequest garantit que req.user est défini
export interface AuthRequest extends ExpressRequestBase {
  user: UserPayload;
}

// Réexporter Response et NextFunction tels quels depuis express
export type Response<ResBody = any> = ExpressResponse<ResBody>;
export type NextFunction = ExpressNextFunction;

// Types pour les gestionnaires de routes utilisant nos types Request/AuthRequest personnalisés
export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response> | void;

export type AuthRouteHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void | Response> | void;

// IMPORTANT: Route files must now import Router directly from 'express'
// Example: import { Router } from 'express';
// const router = Router();
// Do not re-export ExpressRouter or a Router type from here. 