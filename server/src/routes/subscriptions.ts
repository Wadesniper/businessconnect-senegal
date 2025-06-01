import express from 'express';
import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { logger } from '../utils/logger';
import { authenticate } from '../middleware/auth';
import { CinetpayService } from '../services/cinetpayService';
import { config } from '../config';

const router = express.Router();

// Initialisation des services
const subscriptionService = new SubscriptionService();
const cinetpayService = new CinetpayService();

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

// Route de test PUBLIQUE pour CinetPay (sans authentification)
router.get('/test-public', async (req: Request, res: Response) => {
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
    
    const result = await cinetpayService.initializePayment(testData);
    
    res.json({
      success: true,
      message: 'Test CinetPay réussi',
      paymentUrl: result.payment_url,
      transactionId: result.transaction_id,
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

// Route de test pour diagnostiquer CinetPay
router.get('/test-cinetpay', authenticate, async (req: Request, res: Response) => {
  try {
    const testParams = {
      amount: 1000, // Montant de test
      customer_name: 'Test',
      customer_surname: 'User',
      customer_email: 'test@businessconnect.sn',
      customer_phone_number: '+221701234567',
      description: 'Test BusinessConnect'
    };

    console.log('Test CinetPay avec:', testParams);
    
    const payment = await cinetpayService.initializePayment(testParams);
    
    res.json({ 
      success: true, 
      message: 'CinetPay fonctionne correctement',
      payment_url: payment.payment_url,
      transaction_id: payment.transaction_id
    });
  } catch (error: any) {
    console.error('Erreur test CinetPay:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

// Route de debug CinetPay - affiche la configuration et teste l'API
router.get('/debug-cinetpay', authenticate, async (req: Request, res: Response) => {
  try {
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
    
    // Test avec des données minimales
    const testData = {
      amount: 100,
      customer_name: 'Test',
      customer_surname: 'User',
      customer_email: 'test@test.com',
      customer_phone_number: '+221700000000',
      description: 'Test payment'
    };
    
    let testResult = null;
    let testError = null;
    
    try {
      testResult = await cinetpayService.initializePayment(testData);
    } catch (err: any) {
      testError = {
        message: err.message,
        stack: err.stack
      };
    }
    
    res.json({
      debugInfo,
      testData,
      testResult,
      testError
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Erreur debug',
      message: error.message
    });
  }
});

// Initier un nouvel abonnement
router.post('/initiate', authenticate, async (req: Request, res: Response) => {
  try {
    const { userId, subscriptionType, customer_name, customer_surname, customer_email, customer_phone_number } = req.body;

    console.log('=== DÉBUT INITIATION PAIEMENT ===');
    console.log('Requête d\'initiation reçue:', { 
      userId, 
      subscriptionType, 
      customer_name, 
      customer_surname, 
      customer_phone_number, 
      customer_email,
      body: req.body 
    });

    // Vérification détaillée des paramètres
    const missingParams = [];
    if (!userId) missingParams.push('userId');
    if (!subscriptionType) missingParams.push('subscriptionType');
    if (!customer_name) missingParams.push('customer_name');
    if (!customer_surname) missingParams.push('customer_surname');
    if (!customer_phone_number) missingParams.push('customer_phone_number');
    
    if (missingParams.length > 0) {
      console.error('Paramètres manquants:', missingParams);
      res.status(400).json({ 
        error: 'Paramètres manquants',
        missing: missingParams,
        received: req.body
      });
      return;
    }

    // Email obligatoire pour CinetPay - générer un fallback si manquant
    let email = customer_email;
    if (!email || !email.includes('@')) {
      // Générer un email temporaire basé sur le téléphone
      const phoneDigits = customer_phone_number.replace(/[^0-9]/g, '');
      email = `user${phoneDigits}@businessconnect.sn`;
      console.log('Email généré automatiquement:', email);
    }

    console.log('Configuration CinetPay:', {
      hasApiKey: !!config.CINETPAY_APIKEY,
      hasSiteId: !!config.CINETPAY_SITE_ID,
      baseUrl: config.CINETPAY_BASE_URL
    });

    // Utiliser la méthode publique du service d'abonnement
    const payment = await subscriptionService.initiatePayment({
      type: subscriptionType,
      customer_name,
      customer_surname,
      customer_email: email, // Utiliser l'email validé
      customer_phone_number,
      userId
    });

    console.log('Paiement initié avec succès:', payment);

    // Créer un abonnement réel en base (statut pending) avec le paymentId
    await subscriptionService.createSubscription(userId, subscriptionType, payment.paymentId);

    // Réponse cohérente avec le frontend
    res.json({ 
      paymentUrl: payment.redirectUrl,
      transactionId: payment.paymentId,
      amount: subscriptionService.getSubscriptionPrice(subscriptionType),
      currency: 'XOF'
    });
    
    console.log('=== FIN INITIATION PAIEMENT - SUCCÈS ===');
  } catch (error: any) {
    console.error('=== ERREUR INITIATION PAIEMENT ===');
    console.error('Erreur complète:', error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    logger.error('Erreur lors de l\'initiation de l\'abonnement:', error);
    res.status(500).json({ 
      error: error.message || 'Erreur serveur lors de l\'initiation de l\'abonnement',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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