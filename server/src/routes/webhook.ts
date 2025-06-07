import { Router } from 'express';
import { Request, Response, NextFunction } from '../types/custom.express.js';
import { logger } from '../utils/logger.js';
import { WebhookController } from '../controllers/webhookController.js';

const router = Router();
const webhookController = new WebhookController();

// Middleware de logging des webhooks
const logWebhook = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Webhook reçu:', {
    headers: req.headers,
    body: req.body
  });
  next();
};

// Route pour les webhooks CinetPay
router.post('/cinetpay', logWebhook, webhookController.handleCinetPayWebhook);

export default router; 