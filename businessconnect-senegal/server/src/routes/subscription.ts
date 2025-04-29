import { Router } from 'express';
import { subscriptionController } from '../controllers/subscriptionController';

const router = Router();

// Route pour initier un paiement
router.post('/initiate-payment', subscriptionController.initiatePayment);

// Route pour le callback PayTech (IPN)
router.post('/payment-callback', subscriptionController.handlePaymentCallback);

// Route pour vérifier le statut d'un abonnement
router.get('/:userId/status', subscriptionController.checkSubscriptionStatus);

// Route pour récupérer les détails d'un abonnement
router.get('/:userId', subscriptionController.getSubscription);

export default router; 