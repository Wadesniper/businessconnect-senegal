import { Router } from 'express';
import { Request, Response, NextFunction } from '../types/express';
import { logger } from '../utils/logger';

const router = Router();

// Middleware de logging pour les webhooks
const logWebhook = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Webhook reçu:', {
    path: req.path,
    method: req.method,
    body: req.body,
    headers: req.headers
  });
  next();
};

router.use(logWebhook);

// Route de webhook CinetPay
router.post('/', async (req: Request, res: Response) => {
  try {
    // Traitement du webhook
    logger.info('Traitement du webhook CinetPay:', req.body);
    
    // TODO: Implémenter la logique de traitement
    
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Erreur lors du traitement du webhook:', error);
    return res.status(500).json({ success: false, error: 'Erreur interne' });
  }
});

export default router; 