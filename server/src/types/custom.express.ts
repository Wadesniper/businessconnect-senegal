import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction
} from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import * as qs from 'qs';
import { UserPayload } from './user';

/**
 * Notre type Request personnalisé.
 * Étend Express.Request et ajoute `user?: UserPayload`.
 * Préserve les génériques pour la compatibilité.
 */
export interface Request<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends ExpressRequest<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: UserPayload;
}

/**
 * Notre type Response personnalisé.
 * Étend Express.Response.
 * Préserve les génériques pour la compatibilité.
 */
export interface Response<
  ResBody = any,
  Locals extends Record<string, any> = Record<string, any>
> extends ExpressResponse<ResBody, Locals> {}

/**
 * Notre type NextFunction personnalisé.
 */
export interface NextFunction extends ExpressNextFunction {}

/**
 * Interface pour les requêtes authentifiées.
 * Étend notre type `Request` et s'assure que `user` est défini.
 */
export interface AuthRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: UserPayload; // user est défini et non optionnel ici
}

// Types pour les gestionnaires de route utilisant nos types personnalisés
export type RouteHandler = (
  req: Request<any, any, any, any>,
  res: Response<any>,
  next: NextFunction
) => Promise<void | Response<any>> | void;

export type AuthRouteHandler = (
  req: AuthRequest<any, any, any, any>,
  res: Response<any>,
  next: NextFunction
) => Promise<void | Response<any>> | void;

// NE PAS EXPORTER Router d'ici. Il doit être importé de 'express' dans les fichiers de routes.

export interface Controller {
  // Peut être étendue avec des méthodes communes aux contrôleurs si nécessaire
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ message: string; field?: string; [key: string]: any }>;
}

export interface ApiErrorResponse extends ApiResponse<null> {
  success: false;
}

export interface ApiSuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
} 