import { Router } from 'express';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express.js';
import { SubscriptionService } from '../services/subscriptionService.js';
import { logger } from '../utils/logger.js';
import { authenticate } from '../middleware/auth.js';
import { config } from '../config.js';
import { SubscriptionController } from '../controllers/subscriptionController.js';
import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { UserRole } from '../generated/prisma/index.js';

const router = Router();

// Initialisation des services
const subscriptionService = new SubscriptionService();
const subscriptionController = new SubscriptionController();

// Routes publiques
router.post('/initiate', authenticate, subscriptionController.initiateSubscription.bind(subscriptionController));
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
    logger.info('[PAYTECH][IPN] Appel reçu. Body brut:', JSON.stringify(req.body));
    const body = req.body;
    const { type_event, api_key_sha256, api_secret_sha256, ref_command } = body;
    const token = body.token || body.paymentId || body.transaction_id;

    // Vérification officielle PayTech : hash SHA256 clé et secret
    function asciiCodes(str: string): string {
      return str.split('').map((c: string) => c.charCodeAt(0)).join(' ');
    }
    const apiKeyHash = crypto.createHash('sha256').update(config.PAYTECH_API_KEY).digest('hex');
    const apiSecretHash = crypto.createHash('sha256').update(config.PAYTECH_API_SECRET).digest('hex');
    logger.info('[DEBUG PAYTECH] API_KEY_HASH ASCII:', asciiCodes(apiKeyHash));
    logger.info('[DEBUG PAYTECH] api_key_sha256 ASCII:', asciiCodes(body.api_key_sha256));
    logger.info('[DEBUG PAYTECH] API_SECRET_HASH ASCII:', asciiCodes(apiSecretHash));
    logger.info('[DEBUG PAYTECH] api_secret_sha256 ASCII:', asciiCodes(body.api_secret_sha256));

    if (
      apiKeyHash.trim().toLowerCase() !== body.api_key_sha256.trim().toLowerCase() ||
      apiSecretHash.trim().toLowerCase() !== body.api_secret_sha256.trim().toLowerCase()
    ) {
      logger.error('[PAYTECH][IPN] Signature IPN invalide (hash clé ou secret)');
      return res.status(403).json({ success: false, message: 'Signature IPN invalide' });
    }

    logger.info('[PAYTECH][IPN] Signature valide. Event:', type_event, 'Token:', token);

    if (!token) {
      logger.error('[PAYTECH][IPN] Token de paiement manquant dans l\'IPN. Impossible d\'activer l\'abonnement. Body:', JSON.stringify(body));
      return res.status(400).json({ success: false, message: 'Token de paiement manquant dans l\'IPN' });
    }

    // Activation de l'abonnement si paiement confirmé
    if (type_event === 'sale_complete') {
      try {
        logger.info('[PAYTECH][IPN] Recherche abonnement pour token:', token);
        const subscription = await subscriptionService.getSubscriptionByPaymentId(token);
        logger.info('[PAYTECH][IPN] Résultat recherche abonnement:', subscription);
        if (subscription) {
          logger.info('[PAYTECH][IPN] Abonnement trouvé, statut actuel:', subscription.status);
          // Forcer l'activation même si le statut est déjà pending ou autre
          logger.info('[PAYTECH][IPN] Tentative d\'activation forcée de l\'abonnement...');
          await subscriptionService.activateSubscription(subscription.userId, subscription.id);
          logger.info('[PAYTECH][IPN] Abonnement activé (forcé) avec succès pour', subscription.userId);

          // Mise à jour du rôle utilisateur dans la base de données
          try {
            const user = await prisma.user.findUnique({
              where: { id: subscription.userId }
            });
            if (user && user.role !== 'admin') {
              logger.info('[PAYTECH][IPN] Mise à jour du rôle utilisateur:', subscription.userId);
              await prisma.user.update({
                where: { id: subscription.userId },
                data: { role: subscription.type as UserRole }
              });
              logger.info('[PAYTECH][IPN] Rôle utilisateur mis à jour avec succès');
            }
          } catch (error) {
            logger.error('[PAYTECH][IPN] Erreur lors de la mise à jour du rôle utilisateur:', error);
          }
        } else {
          logger.error('[PAYTECH][IPN] Abonnement non trouvé pour token:', token);
        }
      } catch (error) {
        logger.error('[PAYTECH][IPN] Erreur lors de l\'activation de l\'abonnement:', error);
      }
    }

    if (type_event === 'sale_canceled' && token) {
      try {
        const subscription = await subscriptionService.getSubscriptionByPaymentId(token);
        if (subscription && subscription.status !== 'cancelled') {
          await subscriptionService.updateSubscriptionStatus(subscription.id, 'cancelled');
          logger.info('[PAYTECH][IPN] Abonnement annulé pour', subscription.userId);
        }
      } catch (error) {
        logger.error('[PAYTECH][IPN] Erreur lors de l\'annulation de l\'abonnement:', error);
      }
    }

    // Toujours renvoyer 200 à PayTech pour éviter les retries
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('[PAYTECH][IPN] Erreur IPN:', error, 'Body:', JSON.stringify(req.body));
    res.status(200).json({ success: true });
  }
});

export default router; 