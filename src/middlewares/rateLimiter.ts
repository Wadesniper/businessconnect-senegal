import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  statusCode: 429,
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Trop de requêtes, veuillez réessayer plus tard.'
    });
  },
  keyGenerator: (req: Request) => req.ip,
  requestPropertyName: 'rateLimit',
  skipFailedRequests: false,
  skipSuccessfulRequests: false,
  onLimitReached: (req: Request) => {
    logger.warn(`Rate limit reached for IP: ${req.ip}`);
  },
  validate: true,
  store: undefined,
  skip: (req: Request) => false,
  requestWasSuccessful: (req: Request, res: Response) => res.statusCode < 400
}); 