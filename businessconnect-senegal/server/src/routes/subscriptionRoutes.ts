import express from 'express';
import { subscriptionController } from '../controllers/subscriptionController';

const router = express.Router();

// Routes protégées par authentification
router.post('/initiate-payment', subscriptionController.initiatePayment);
router.get('/:userId', subscriptionController.getSubscription);
router.put('/:userId/status', subscriptionController.updateSubscriptionStatus);
router.get('/:userId/status', subscriptionController.checkSubscriptionStatus);

export default router; 