import { Router, Request, Response, NextFunction } from '../types/express';
import { WebhookController } from '../controllers/webhookController';
import { logger } from '../utils/logger';

const router = Router();
const webhookController = new WebhookController();

// Route pour le webhook CinetPay
router.post('/cinetpay', webhookController.handleCinetPayWebhook);

// Middleware de logging pour tous les webhooks
router.use((req: Request, res: Response, next: NextFunction) => {
  logger.info('Webhook reçu:', {
    path: req.path,
    method: req.method,
    body: req.body,
    headers: req.headers
  });
  next();
});

export default router; 