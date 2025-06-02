import { Request, Response } from 'express';
export declare const rateLimiter: (req: Request, res: Response, next: import("express").NextFunction) => void;
