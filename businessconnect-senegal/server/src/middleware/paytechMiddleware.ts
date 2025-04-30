import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';

export const paytechMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      api_key_sha256,
      api_secret_sha256
    } = req.body;

    const my_api_key = process.env.PAYTECH_API_KEY;
    const my_api_secret = process.env.PAYTECH_API_SECRET;

    if (!my_api_key || !my_api_secret) {
      logger.error('Clés PayTech non configurées');
      return res.status(500).json({ error: 'Configuration PayTech manquante' });
    }

    const isValidRequest = 
      crypto.createHash('sha256').update(my_api_secret).digest('hex') === api_secret_sha256 &&
      crypto.createHash('sha256').update(my_api_key).digest('hex') === api_key_sha256;

    if (!isValidRequest) {
      logger.error('Tentative de callback PayTech invalide');
      return res.status(403).json({ error: 'Requête non autorisée' });
    }

    next();
  } catch (error) {
    logger.error('Erreur dans le middleware PayTech:', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}; 