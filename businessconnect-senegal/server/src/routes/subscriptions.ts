import express from 'express';
import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { authenticateToken } from '../middleware/authMiddleware';
import { validatePaytechCallback } from '../middleware/paytechMiddleware';
import { logger } from '../utils/logger';

const router = express.Router();
const subscriptionService = new SubscriptionService();

// Récupérer l'abonnement d'un utilisateur
router.get('/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const subscription = await subscriptionService.getSubscription(userId);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }
    
    res.json(subscription);
  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'abonnement:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'abonnement' });
  }
});

// Vérifier le statut d'un abonnement
router.get('/:userId/status', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const status = await subscriptionService.checkSubscriptionStatus(userId);
    res.json({ status });
  } catch (error) {
    logger.error('Erreur lors de la vérification du statut:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la vérification du statut' });
  }
});

// Initier un nouvel abonnement
router.post('/initiate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId, subscriptionType } = req.body;

    if (!userId || !subscriptionType) {
      return res.status(400).json({ message: 'UserId et type d\'abonnement requis' });
    }

    const paymentInitiation = await subscriptionService.createSubscription(userId, subscriptionType);
    res.json(paymentInitiation);
  } catch (error) {
    logger.error('Erreur lors de l\'initiation de l\'abonnement:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'initiation de l\'abonnement' });
  }
});

// Callback PayTech pour la confirmation du paiement
router.post('/payment-callback', validatePaytechCallback, async (req: Request, res: Response) => {
  try {
    const { reference, status, userId } = req.body;

    if (status === 'success') {
      await subscriptionService.updateSubscriptionStatus(userId, 'active');
      logger.info(`Paiement réussi pour la référence: ${reference}`);
      res.json({ message: 'Paiement confirmé et abonnement activé' });
    } else {
      await subscriptionService.updateSubscriptionStatus(userId, 'expired');
      logger.warn(`Échec du paiement pour la référence: ${reference}`);
      res.status(400).json({ message: 'Échec du paiement' });
    }
  } catch (error) {
    logger.error('Erreur lors du traitement du callback de paiement:', error);
    res.status(500).json({ message: 'Erreur serveur lors du traitement du callback' });
  }
});

export default router; 