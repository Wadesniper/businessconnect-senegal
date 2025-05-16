import express from 'express';
import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { NotificationService } from '../services/notificationService';
import { logger } from '../utils/logger';

const router = express.Router();

// Initialisation des services
const notificationService = new NotificationService({
  daysBeforeExpiration: [7, 3, 1]
});
const subscriptionService = new SubscriptionService();

// Récupérer l'abonnement d'un utilisateur
router.get('/:userId', async (req: Request, res: Response) => {
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
router.get('/:userId/status', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const isActive = await subscriptionService.checkSubscriptionStatus(userId);
    res.json({ isActive });
  } catch (error) {
    logger.error('Erreur lors de la vérification du statut:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la vérification du statut' });
  }
});

// Initier un nouvel abonnement
router.post('/initiate', async (req: Request, res: Response) => {
  try {
    const { userId, subscriptionType } = req.body;

    if (!userId || !subscriptionType) {
      return res.status(400).json({ message: 'UserId et type d\'abonnement requis' });
    }

    const paymentInitiation = await subscriptionService.initiatePayment(userId, subscriptionType);
    res.json(paymentInitiation);
  } catch (error) {
    logger.error('Erreur lors de l\'initiation de l\'abonnement:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'initiation de l\'abonnement' });
  }
});

export default router; 