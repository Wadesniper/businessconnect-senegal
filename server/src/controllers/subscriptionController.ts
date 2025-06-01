import { Request, Response } from 'express';
import { AuthRequest } from '../types/user';
import { SubscriptionService } from '../services/subscriptionService';
import { logger } from '../utils/logger';

export class SubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  initiateSubscription = async (req: AuthRequest, res: Response) => {
    try {
      const { userId, subscriptionType, customer_name, customer_surname, customer_email, customer_phone_number } = req.body;

      logger.info('Initiation de l\'abonnement:', {
        userId,
        subscriptionType,
        customer_name,
        customer_surname,
        customer_phone_number
      });

      // Vérification des paramètres requis
      const missingParams = [];
      if (!userId) missingParams.push('userId');
      if (!subscriptionType) missingParams.push('subscriptionType');
      if (!customer_name) missingParams.push('customer_name');
      if (!customer_surname) missingParams.push('customer_surname');
      if (!customer_phone_number) missingParams.push('customer_phone_number');

      if (missingParams.length > 0) {
        logger.error('Paramètres manquants:', missingParams);
        return res.status(400).json({
          success: false,
          message: 'Paramètres manquants',
          missing: missingParams
        });
      }

      // Email obligatoire pour CinetPay - générer un fallback si manquant
      let email = customer_email;
      if (!email || !email.includes('@')) {
        const phoneDigits = customer_phone_number.replace(/[^0-9]/g, '');
        email = `user${phoneDigits}@businessconnect.sn`;
        logger.info('Email généré:', email);
      }

      // Vérifier si l'utilisateur a déjà un abonnement actif
      const existingSubscription = await this.subscriptionService.getActiveSubscription(userId);
      if (existingSubscription) {
        logger.warn('Utilisateur a déjà un abonnement actif:', {
          userId,
          subscriptionId: existingSubscription._id
        });
        return res.status(400).json({
          success: false,
          message: 'Vous avez déjà un abonnement actif'
        });
      }

      // Initier le paiement
      const payment = await this.subscriptionService.initiatePayment({
        type: subscriptionType,
        customer_name,
        customer_surname,
        customer_email: email,
        customer_phone_number,
        userId
      });

      logger.info('Paiement initié:', {
        userId,
        paymentId: payment.paymentId,
        redirectUrl: payment.redirectUrl
      });

      // Créer l'abonnement en attente
      await this.subscriptionService.createSubscription(userId, subscriptionType, payment.paymentId);

      res.json({
        success: true,
        paymentUrl: payment.redirectUrl,
        transactionId: payment.paymentId
      });
    } catch (error: any) {
      logger.error('Erreur lors de l\'initiation de l\'abonnement:', {
        error: error.message,
        stack: error.stack
      });

      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de l\'initiation de l\'abonnement'
      });
    }
  };

  getSubscription = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.userId || req.user?.id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID utilisateur requis'
        });
      }

      const subscription = await this.subscriptionService.getSubscription(userId);

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Aucun abonnement trouvé'
        });
      }

      res.json({
        success: true,
        subscription
      });
    } catch (error: any) {
      logger.error('Erreur lors de la récupération de l\'abonnement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'abonnement'
      });
    }
  };

  cancelSubscription = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      await this.subscriptionService.updateSubscription(userId, {
        status: 'cancelled'
      });

      res.json({
        success: true,
        message: 'Abonnement annulé avec succès'
      });
    } catch (error: any) {
      logger.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'annulation de l\'abonnement'
      });
    }
  };
} 