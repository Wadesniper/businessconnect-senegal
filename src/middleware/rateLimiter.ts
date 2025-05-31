import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  statusCode: 429,
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard.'
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Trop de requêtes, veuillez réessayer plus tard.'
    });
  },
  skipFailedRequests: false,
  skipSuccessfulRequests: false,
  legacyHeaders: false,
  standardHeaders: true
});

export default rateLimiter; 