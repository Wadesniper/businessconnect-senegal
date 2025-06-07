import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: {
    status: 'error',
    message: 'Trop de requêtes, veuillez réessayer plus tard.'
  },
  handler: (req, res, _next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 