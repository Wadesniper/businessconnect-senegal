import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction
} from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { UserPayload } from './user';

// Type de base pour Request, alias direct de Express.Request
// L'augmentation globale dans express-request.d.ts ajoute `user?` à ExpressRequest.
export type Request = ExpressRequest;

// AuthRequest garantit que req.user est défini.
// Étend ExpressRequest (qui inclut déjà `body`, `params`, etc.)
export interface AuthRequest extends ExpressRequest {
  user: UserPayload; // Rend `user` non optionnel
}

// Type de base pour Response, alias direct de Express.Response
export type Response<ResBody = any> = ExpressResponse<ResBody>;

// Type de base pour NextFunction, alias direct de Express.NextFunction
export type NextFunction = ExpressNextFunction;

// Types optionnels pour les gestionnaires de routes, si vous souhaitez les utiliser
export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any>> | void;

export type AuthRouteHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any>> | void;

// RAPPEL IMPORTANT : Ne PAS exporter de type 'Router' depuis ce fichier.
// Les fichiers de routes doivent importer 'Router' directement depuis 'express'.
// exemple: import { Router } from 'express'; 