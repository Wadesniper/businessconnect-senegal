import express from 'express';
import { WebhookController } from '../controllers/webhookController';

const router = express.Router();
const webhookController = new WebhookController();

// Route pour le webhook PayTech
router.post('/paytech', webhookController.handlePaytechWebhook);

export default router; 