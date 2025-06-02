import { Request, Response, NextFunction } from 'express';

declare module 'express-rate-limit' {
  export interface Options {
    windowMs?: number;
    max?: number;
    message?: any;
    statusCode?: number;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
    requestPropertyName?: string;
    store?: any;
    validate?: any;
    requestWasSuccessful?: (req: Request, res: Response) => boolean;
    skip?: (req: Request, res: Response) => boolean;
    keyGenerator?: (req: Request) => string;
    handler?: (req: Request, res: Response) => void;
    onLimitReached?: (req: Request, res: Response) => void;
  }

  export interface RateLimitRequestHandler {
    (req: Request, res: Response, next: NextFunction): void;
  }

  export default function rateLimit(options?: Options): (req: Request, res: Response, next: NextFunction) => void;
} 