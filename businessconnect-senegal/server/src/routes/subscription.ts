import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authMiddleware } from '../middleware/authMiddleware';
import { SubscriptionController } from '../controllers/subscriptionController';

const router = express.Router();
const subscriptionController = new SubscriptionController();

// Routes publiques
router.get('/plans', subscriptionController.getSubscriptionPlans);

// Routes protégées
router.use(authMiddleware);

// Obtenir l'abonnement actuel
router.get('/current', subscriptionController.getCurrentSubscription);

// Souscrire à un plan
router.post(
  '/subscribe',
  [
    body('plan')
      .isIn(['etudiant', 'annonceur', 'recruteur'])
      .withMessage('Plan invalide'),
    body('duration')
      .isIn([1, 3, 6, 12])
      .withMessage('Durée invalide')
  ],
  validateRequest,
  subscriptionController.subscribe
);

// Annuler l'abonnement
router.post('/cancel', subscriptionController.cancelSubscription);

// Renouveler l'abonnement
router.post('/renew', subscriptionController.renewSubscription);

// Webhook PayTech
router.post('/webhook', subscriptionController.handlePayTechWebhook);

export default router; 