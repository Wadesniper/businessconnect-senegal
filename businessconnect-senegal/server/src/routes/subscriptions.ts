import express from 'express';
import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { NotificationService } from '../services/notificationService';
import { PayTech } from '../services/paytechService';
import { authenticate } from '../middleware/authMiddleware';
import { paytechMiddleware } from '../middleware/paytechMiddleware';
import { logger } from '../utils/logger';
import { PayTechCallbackData } from '../types/subscription';

const router = express.Router();

// Initialisation des services
const notificationService = new NotificationService({
  daysBeforeExpiration: [7, 3, 1]
});
const payTechService = new PayTech(
  process.env.PAYTECH_API_KEY || '',
  process.env.PAYTECH_WEBHOOK_SECRET,
  process.env.PAYTECH_API_URL || 'https://api.paytech.sn'
);
const subscriptionService = new SubscriptionService(notificationService, payTechService);

// Récupérer l'abonnement d'un utilisateur
router.get('/:userId', authenticate, async (req: Request, res: Response) => {
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
router.get('/:userId/status', authenticate, async (req: Request, res: Response) => {
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
router.post('/initiate', authenticate, async (req: Request, res: Response) => {
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

// Callback PayTech pour la confirmation du paiement
router.post('/payment-callback', paytechMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      type_event,
      custom_field,
      payment_id,
      amount,
      transaction_id
    } = req.body;

    const callbackData: PayTechCallbackData = {
      paymentId: payment_id,
      amount: amount,
      status: type_event === 'SUCCESS_PAYMENT' ? 'completed' : 'failed',
      customField: custom_field,
      transactionId: transaction_id
    };

    await subscriptionService.handlePaymentCallback(callbackData);
    
    res.json({ message: 'Callback traité avec succès' });
  } catch (error) {
    logger.error('Erreur lors du traitement du callback de paiement:', error);
    res.status(500).json({ message: 'Erreur serveur lors du traitement du callback' });
  }
});

export default router; 