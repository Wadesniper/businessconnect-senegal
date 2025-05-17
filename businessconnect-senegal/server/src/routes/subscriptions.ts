import express from 'express';
import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { logger } from '../utils/logger';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Initialisation des services
const subscriptionService = new SubscriptionService();

// Récupérer l'abonnement d'un utilisateur
router.get('/:userId', authenticate, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const subscription = await subscriptionService.getSubscription(userId);
    
    if (!subscription) {
      res.status(404).json({ error: 'Abonnement non trouvé' });
      return;
    }
    res.json(subscription);
    return;
  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'abonnement:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'abonnement' });
    return;
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
    const { userId, subscriptionType, customer_name, customer_surname, customer_email, customer_phone_number } = req.body;

    if (!userId || !subscriptionType || !customer_name || !customer_surname || !customer_email || !customer_phone_number) {
      res.status(400).json({ error: 'Paramètres manquants' });
      return;
    }

    // Créer un abonnement réel en base (statut pending)
    await subscriptionService.createSubscription(userId, subscriptionType);

    // Retourner une fausse URL de paiement pour les tests
    const paymentUrl = `http://localhost:3000/fake-payment?userId=${userId}`;
    res.json({ paymentUrl });
    return;
  } catch (error) {
    logger.error('Erreur lors de l\'initiation de l\'abonnement:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'initiation de l\'abonnement' });
    return;
  }
});

// Callback de paiement (simulation)
router.post('/payment-callback', async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.body;
    if (!userId || !status) {
      return res.status(400).json({ error: 'Paramètres manquants' });
    }
    // Récupérer l'abonnement le plus récent
    const subscription = await subscriptionService.getSubscription(userId);
    if (!subscription) {
      return res.status(404).json({ error: 'Abonnement non trouvé' });
    }
    if (status === 'success') {
      const updated = await subscriptionService.updateSubscription(userId, { status: 'active' });
      if (!updated) {
        return res.status(500).json({ error: 'Erreur lors de l\'activation de l\'abonnement' });
      }
      return res.status(200).json({ message: 'Abonnement activé' });
    } else if (status === 'failed') {
      const updated = await subscriptionService.updateSubscription(userId, { status: 'expired' });
      if (!updated) {
        return res.status(500).json({ error: 'Erreur lors de l\'expiration de l\'abonnement' });
      }
      return res.status(400).json({ error: 'Paiement échoué, abonnement expiré' });
    } else {
      return res.status(400).json({ error: 'Statut de paiement inconnu' });
    }
  } catch (error) {
    logger.error('Erreur lors du callback de paiement:', error);
    res.status(500).json({ error: 'Erreur serveur lors du callback de paiement' });
    return;
  }
});

export default router; 