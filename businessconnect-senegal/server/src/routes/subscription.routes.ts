import { Router } from 'express';
import { subscriptionController } from '../controllers/subscription.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Routes publiques
router.post('/payment-callback', subscriptionController.handlePaymentCallback);

// Routes protégées
router.use(authMiddleware);

// Gestion des souscriptions
router.get('/:userId', subscriptionController.getSubscription);
router.get('/:userId/status', subscriptionController.checkSubscriptionStatus);

// Paiements
router.post('/initiate', subscriptionController.initiatePayment);
router.get('/:userId/payment-history', subscriptionController.getPaymentHistory);

export default router; 