import { Router, Request, Response, NextFunction, RouteHandler } from '../types/express';
import { WebhookController } from '../controllers/webhookController';
import { logger } from '../utils/logger';

const router = Router();
const webhookController = new WebhookController();

// Middleware de logging pour tous les webhooks
const loggingMiddleware: RouteHandler = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Webhook reçu:', {
    path: req.path,
    method: req.method,
    body: req.body,
    headers: req.headers
  });
  next();
};

router.use(loggingMiddleware);

// Route pour le webhook CinetPay
router.post('/cinetpay', async (req: Request, res: Response) => {
  try {
    await webhookController.handleCinetPayWebhook(req, res);
  } catch (error) {
    logger.error('Erreur lors du traitement du webhook CinetPay:', error);
    res.status(500).json({ error: 'Erreur lors du traitement du webhook' });
  }
});

export default router; 