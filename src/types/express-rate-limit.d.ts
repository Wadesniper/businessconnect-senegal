import { Request, Response, NextFunction } from 'express';

declare module 'express-rate-limit' {
  export interface Options {
    windowMs?: number;
    max?: number;
    message?: any;
    statusCode?: number;
    headers?: boolean;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
    requestWasSuccessful?: (req: Request, res: Response) => boolean;
    skip?: (req: Request, res: Response) => boolean;
    keyGenerator?: (req: Request, res: Response) => string;
    handler?: (req: Request, res: Response, next: NextFunction) => void;
    onLimitReached?: (req: Request, res: Response, optionsUsed: Options) => void;
  }

  export interface RateLimitRequestHandler {
    (req: Request, res: Response, next: NextFunction): void;
  }

  export default function rateLimit(options?: Options): RateLimitRequestHandler;
} 