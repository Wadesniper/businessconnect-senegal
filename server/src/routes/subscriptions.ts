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
  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'abonnement:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'abonnement' });
  }
});

// Vérifier le statut d'un abonnement
router.get('/:userId/status', authenticate, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // @ts-ignore
    const userRole = req.user?.role;
    const isActive = await subscriptionService.checkSubscriptionAccess(userId, userRole);
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

    if (!userId || !subscriptionType || !customer_name || !customer_surname || !customer_phone_number) {
      res.status(400).json({ error: 'Paramètres manquants' });
      return;
    }

    // Utiliser la méthode publique du service d'abonnement
    const payment = await subscriptionService.initiatePayment({
      type: subscriptionType,
      customer_name,
      customer_surname,
      customer_email,
      customer_phone_number,
      userId
    });

    // Créer un abonnement réel en base (statut pending) avec le paymentId
    await subscriptionService.createSubscription(userId, subscriptionType, payment.paymentId);

    res.json({ paymentUrl: payment.redirectUrl });
  } catch (error) {
    logger.error('Erreur lors de l\'initiation de l\'abonnement:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'initiation de l\'abonnement' });
  }
});

// Callback de paiement (simulation)
router.post('/payment-callback', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, status } = req.body;
    if (!userId || !status) {
      res.status(400).json({ error: 'Paramètres manquants' });
      return;
    }
    // Récupérer l'abonnement le plus récent
    const subscription = await subscriptionService.getSubscription(userId);
    if (!subscription) {
      res.status(404).json({ error: 'Abonnement non trouvé' });
      return;
    }
    if (status === 'success') {
      const updated = await subscriptionService.updateSubscription(userId, { status: 'active' });
      res.status(200).json({ message: 'Abonnement activé', subscription: updated });
      return;
    } else if (status === 'expired') {
      const updated = await subscriptionService.updateSubscription(userId, { status: 'expired' });
      res.status(200).json({ message: 'Abonnement expiré', subscription: updated });
      return;
    } else {
      res.status(400).json({ error: 'Statut de paiement invalide' });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: (error as Error).message });
    return;
  }
});

// Route de notification CinetPay
router.post('/notify', async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Notification CinetPay reçue:', req.body);
    
    const { cpm_trans_id, cpm_result, cpm_trans_status } = req.body;
    
    if (!cpm_trans_id) {
      logger.error('Transaction ID manquant dans la notification CinetPay');
      res.status(400).json({ error: 'Transaction ID manquant' });
      return;
    }

    // Chercher l'abonnement correspondant au transaction_id
    const subscription = await subscriptionService.getSubscriptionByPaymentId(cpm_trans_id);
    
    if (!subscription) {
      logger.error(`Abonnement introuvable pour transaction ${cpm_trans_id}`);
      res.status(404).json({ error: 'Abonnement non trouvé' });
      return;
    }

    // Traiter selon le statut du paiement
    if (cpm_result === '00' && cpm_trans_status === 'ACCEPTED') {
      // Paiement réussi
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Ajouter 1 mois
      
      await subscriptionService.updateSubscription(subscription.userId, {
        status: 'active',
        paymentId: cpm_trans_id,
        expiresAt: endDate
      });
      
      logger.info(`Abonnement activé pour l'utilisateur ${subscription.userId}`);
    } else {
      // Paiement échoué ou annulé
      await subscriptionService.updateSubscription(subscription.userId, {
        status: 'cancelled',
        paymentId: cpm_trans_id
      });
      
      logger.info(`Paiement échoué pour l'utilisateur ${subscription.userId}`);
    }

    res.status(200).json({ status: 'success', message: 'Notification traitée' });
  } catch (error) {
    logger.error('Erreur lors du traitement de la notification CinetPay:', error);
    res.status(500).json({ error: 'Erreur serveur lors du traitement de la notification' });
  }
});

export default router; 