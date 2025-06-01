import express from 'express';
import { WebhookController } from '../controllers/webhookController';
import { logger } from '../utils/logger';

const router = express.Router();
const webhookController = new WebhookController();

// Route de notification CinetPay (non protégée)
router.post('/payment', (req, res) => {
  logger.info('Webhook CinetPay reçu:', {
    body: req.body,
    headers: req.headers
  });
  return webhookController.handlePaymentWebhook(req, res);
});

export default router; 