import express from 'express';
import { subscriptionController } from '../controllers/subscriptionController';
import { authMiddleware } from '../middleware/auth';
import { paytechMiddleware } from '../middleware/paytechMiddleware';

const router = express.Router();

// Routes protégées par authentification
router.post('/initiate-payment', authMiddleware, subscriptionController.initiatePayment);
router.get('/:userId', authMiddleware, subscriptionController.getSubscription);
router.put('/:userId/status', authMiddleware, subscriptionController.updateSubscriptionStatus);
router.get('/:userId/status', authMiddleware, subscriptionController.checkSubscriptionStatus);

// Route de callback PayTech (non protégée par auth car appelée par PayTech)
router.post('/payment-callback', paytechMiddleware, subscriptionController.handlePaymentCallback);

export default router; 