import { Router } from 'express';
import { WebhookController } from '../controllers/webhookController';

const router = Router();
const webhookController = new WebhookController();

// Routes pour les webhooks
router.post('/paytech', webhookController.handlePaymentWebhook);

export default router; 