import { Router } from 'express';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express.js';
import { SubscriptionService } from '../services/subscriptionService.js';
import { logger } from '../utils/logger.js';
import { authenticate } from '../middleware/auth.js';
import { config } from '../config.js';
import { SubscriptionController } from '../controllers/subscriptionController.js';
import crypto from 'crypto';

const router = Router();

// Initialisation des services
const subscriptionService = new SubscriptionService();
const subscriptionController = new SubscriptionController();

// Routes publiques
router.post('/initiate', subscriptionController.initiateSubscription.bind(subscriptionController));
router.post('/activate', subscriptionController.activateSubscription.bind(subscriptionController));
router.get('/status/:userId', subscriptionController.checkSubscriptionStatus.bind(subscriptionController));

// Routes protégées
router.get('/:userId', authenticate, subscriptionController.getSubscription.bind(subscriptionController));
router.delete('/:userId', authenticate, subscriptionController.cancelSubscription.bind(subscriptionController));

// Vérifier le statut d'un abonnement
router.get('/:userId/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) { return res.status(401).json({ error: 'Authentification requise' }); }
    const { userId } = authReq.params;
    const subscription = await subscriptionService.getSubscription(userId);
    
    if (!subscription) {
      return res.status(404).json({ error: 'Abonnement non trouvé' });
    }
    return res.json(subscription);
  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'abonnement:', error);
    next(error);
  }
});

// Vérifier le statut d'un abonnement
router.get('/:userId/access', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) { return res.status(401).json({ error: 'Authentification requise' }); }
    const { userId } = authReq.params;
    const userRole = authReq.user.role;
    const isActive = await subscriptionService.checkSubscriptionAccess(userId, userRole);
    res.json({ isActive });
  } catch (error) {
    logger.error('Erreur lors de la vérification du statut:', error);
    next(error);
  }
});

// IPN PayTech (notification de paiement)
router.post('/ipn', async (req, res) => {
  try {
    const body = req.body;
    const { type_event, api_key_sha256, api_secret_sha256, ref_command, token } = body;
    
    // Vérification de la signature
    const myApiKey = config.PAYTECH_API_KEY;
    const myApiSecret = config.PAYTECH_API_SECRET;
    const hashKey = crypto.createHash('sha256').update(myApiKey).digest('hex');
    const hashSecret = crypto.createHash('sha256').update(myApiSecret).digest('hex');
    
    if (hashKey !== api_key_sha256 || hashSecret !== api_secret_sha256) {
      logger.error('[PAYTECH] IPN signature invalide');
      return res.status(403).json({ success: false, message: 'Signature IPN invalide' });
    }
    
    logger.info('[PAYTECH] IPN reçu:', body);
    
    // Activation de l'abonnement si paiement confirmé
    if (type_event === 'sale_complete' && token) {
      try {
        // On retrouve l'abonnement par paymentId/token
        const subscription = await subscriptionService.getSubscriptionByPaymentId(token);
        if (subscription) {
          if (subscription.status !== 'active') {
            // Activation immédiate de l'abonnement
            await subscriptionService.activateSubscription(subscription.userId, subscription.id);
            logger.info('[PAYTECH] Abonnement activé avec succès pour', subscription.userId);
          } else {
            logger.info('[PAYTECH] Abonnement déjà actif pour', subscription.userId);
          }
        } else {
          logger.error('[PAYTECH] Abonnement non trouvé pour token:', token);
        }
      } catch (error) {
        logger.error('[PAYTECH] Erreur lors de l\'activation de l\'abonnement:', error);
        // On continue pour renvoyer 200 à PayTech
      }
    }
    
    if (type_event === 'sale_canceled' && token) {
      try {
        const subscription = await subscriptionService.getSubscriptionByPaymentId(token);
        if (subscription && subscription.status !== 'cancelled') {
          await subscriptionService.updateSubscriptionStatus(subscription.id, 'cancelled');
          logger.info('[PAYTECH] Abonnement annulé pour', subscription.userId);
        }
      } catch (error) {
        logger.error('[PAYTECH] Erreur lors de l\'annulation de l\'abonnement:', error);
      }
    }
    
    // Toujours renvoyer 200 à PayTech pour éviter les retries
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('[PAYTECH] Erreur IPN:', error);
    // On renvoie quand même 200 pour éviter les retries
    res.status(200).json({ success: true });
  }
});

export default router; 