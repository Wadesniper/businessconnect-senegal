import { Router, Request as ExpressRequestBase, Response as ExpressResponse, NextFunction } from 'express';
import { Request, AuthRequest } from '../types/express';
import { SubscriptionService } from '../services/subscriptionService';
import { logger } from '../utils/logger';
import { authenticate } from '../middleware/auth';
import { cinetpayService, PaymentResponse } from '../services/cinetpayService';
import { config } from '../config';
import { SubscriptionController } from '../controllers/subscriptionController';
import { WebhookController } from '../controllers/webhookController';

const router = Router();

// Initialisation des services
const subscriptionService = new SubscriptionService();
const subscriptionController = new SubscriptionController();
const webhookController = new WebhookController();

// Middleware d'authentification pour toutes les routes sauf le webhook
router.post('/webhook/cinetpay', webhookController.handleCinetPayWebhook as any);
router.use(authenticate);

// Routes protégées
router.get('/:userId', subscriptionController.getSubscription as any);

// Vérifier le statut d'un abonnement
router.get('/:userId/status', async (req: Request, res: ExpressResponse, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
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
router.get('/:userId/access', async (req: Request, res: ExpressResponse, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const { userId } = authReq.params;
    const userRole = authReq.user.role;
    const isActive = await subscriptionService.checkSubscriptionAccess(userId, userRole);
    res.json({ isActive });
  } catch (error) {
    logger.error('Erreur lors de la vérification du statut:', error);
    next(error);
  }
});

// Route de test PUBLIQUE pour CinetPay (sans authentification)
router.get('/test-public', async (req: ExpressRequestBase, res: ExpressResponse) => {
  try {
    console.log('=== TEST PUBLIC CINETPAY ===');
    
    // Vérifier la configuration
    const configStatus = {
      hasApiKey: !!config.CINETPAY_APIKEY,
      hasSiteId: !!config.CINETPAY_SITE_ID,
      apiKeyLength: config.CINETPAY_APIKEY?.length || 0,
      siteIdLength: config.CINETPAY_SITE_ID?.length || 0,
      baseUrl: config.CINETPAY_BASE_URL
    };
    
    console.log('Configuration:', configStatus);
    
    if (!configStatus.hasApiKey || !configStatus.hasSiteId) {
      res.json({
        success: false,
        error: 'Configuration CinetPay manquante',
        config: configStatus,
        message: 'Les clés API CinetPay ne sont pas configurées sur le serveur'
      });
      return;
    }
    
    // Test avec des données minimales
    const testData = {
      amount: 100,
      customer_name: 'Test',
      customer_surname: 'Public',
      customer_email: 'test@public.com',
      customer_phone_number: '+221700000000',
      description: 'Test public payment'
    };
    
    const result = await cinetpayService.createPayment(testData as any);
    
    res.json({
      success: true,
      message: 'Test CinetPay réussi',
      paymentUrl: (result as any).payment_url || (result as any).link,
      transactionId: (result as any).transaction_id || (result as any).data?.transaction_id,
      config: configStatus
    });
    
  } catch (error: any) {
    console.error('Erreur test public:', error);
    res.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Route de test pour diagnostiquer CinetPay - req est Request, casté en AuthRequest à l'intérieur
router.get('/test-cinetpay-diag', async (req: Request, res: ExpressResponse, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest; // Cast ici
    const testParams = {
      amount: 1000,
      customer_name: authReq.user.firstName || 'Test',
      customer_surname: authReq.user.lastName || 'User',
      customer_email: authReq.user.email,
      customer_phone_number: '+221701234567',
      description: 'Test BusinessConnect'
    };
    logger.info('Test CinetPay avec:', testParams);
    const payment = await cinetpayService.createPayment(testParams as any);
    
    res.json({ 
      success: true, 
      message: 'CinetPay fonctionne correctement',
      payment_url: (payment as any).payment_url || (payment as any).link,
      transaction_id: (payment as any).transaction_id || (payment as any).data?.transaction_id
    });
  } catch (error: any) {
    logger.error('Erreur test CinetPay:', error);
    next(error); // Passer l'erreur au gestionnaire d'erreurs Express
  }
});

// Route de debug CinetPay - affiche la configuration et teste l'API
router.get('/debug-cinetpay', async (req: Request, res: ExpressResponse, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const hasApiKey = !!config.CINETPAY_APIKEY;
    const hasSiteId = !!config.CINETPAY_SITE_ID;
    
    const debugInfo = {
      config: {
        hasApiKey,
        hasSiteId,
        apiKeyLength: config.CINETPAY_APIKEY?.length || 0,
        siteIdLength: config.CINETPAY_SITE_ID?.length || 0,
        baseUrl: config.CINETPAY_BASE_URL,
        returnUrl: config.CINETPAY_RETURN_URL,
        notifyUrl: config.CINETPAY_NOTIFY_URL
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasEnvApiKey: !!process.env.CINETPAY_APIKEY,
        hasEnvSiteId: !!process.env.CINETPAY_SITE_ID
      }
    };
    
    const testData = {
      amount: 100,
      userId: authReq.user.id,
      description: 'Test payment debug'
    };
    
    let paymentDetails: PaymentResponse | null = null;
    let testError: { message: string; stack?: string } | null = null;
    
    try {
      paymentDetails = await cinetpayService.createPayment(testData);
    } catch (err: any) {
      testError = { message: err.message, stack: err.stack };
    }
    
    res.json({
      debugInfo,
      testData,
      testResult: paymentDetails ? {
        success: paymentDetails.status === 'success' || paymentDetails.status === 'pending',
        status: paymentDetails.status,
        transaction_id: paymentDetails.id,
      } : null,
      testError
    });
  } catch (error: any) {
    next(error);
  }
});

// Initier un nouvel abonnement
router.post('/initiate', subscriptionController.initiateSubscription as any);

// Activer un abonnement après paiement
router.post('/activate', subscriptionController.activateSubscription as any);

// Vérifier le statut d'un abonnement
router.get('/status/:userId', subscriptionController.checkSubscriptionStatus as any);

// Callback de paiement (simulation)
router.post('/payment-callback', async (req: ExpressRequestBase, res: ExpressResponse) => {
  try {
    const { userId, status } = req.body;
    if (!userId || !status) {
      return res.status(400).json({ error: 'Paramètres manquants' });
    }
    
    const subscription = await subscriptionService.getSubscription(userId);
    if (!subscription) {
      return res.status(404).json({ error: 'Abonnement non trouvé' });
    }
    
    if (status === 'success') {
      const updated = await subscriptionService.updateSubscription(userId, { status: 'active' });
      return res.status(200).json({ message: 'Abonnement activé', subscription: updated });
    } else if (status === 'expired') {
      const updated = await subscriptionService.updateSubscription(userId, { status: 'expired' });
      return res.status(200).json({ message: 'Abonnement expiré', subscription: updated });
    } else {
      return res.status(400).json({ error: 'Statut de paiement invalide' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur', details: (error as Error).message });
  }
});

// Route de notification CinetPay
router.post('/notify', async (req: ExpressRequestBase, res: ExpressResponse) => {
  try {
    logger.info('Notification CinetPay reçue:', req.body);
    
    const { cpm_trans_id, cpm_result, cpm_trans_status } = req.body;
    
    if (!cpm_trans_id) {
      logger.error('Transaction ID manquant dans la notification CinetPay');
      return res.status(400).json({ error: 'Transaction ID manquant' });
    }

    const subscription = await subscriptionService.getSubscriptionByPaymentId(cpm_trans_id);
    
    if (!subscription) {
      logger.error(`Abonnement introuvable pour transaction ${cpm_trans_id}`);
      return res.status(404).json({ error: 'Abonnement non trouvé' });
    }

    if (cpm_result === '00' && cpm_trans_status === 'ACCEPTED') {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      await subscriptionService.updateSubscription(subscription.userId, {
        status: 'active',
        paymentId: cpm_trans_id,
        expiresAt: endDate
      });
      
      logger.info(`Abonnement activé pour l'utilisateur ${subscription.userId}`);
    } else {
      await subscriptionService.updateSubscription(subscription.userId, {
        status: 'cancelled',
        paymentId: cpm_trans_id
      });
      
      logger.info(`Paiement échoué pour l'utilisateur ${subscription.userId}`);
    }

    return res.status(200).json({ status: 'success', message: 'Notification traitée' });
  } catch (error) {
    logger.error('Erreur lors du traitement de la notification CinetPay:', error);
    return res.status(500).json({ error: 'Erreur serveur lors du traitement de la notification' });
  }
});

export default router; 