import { Types } from 'mongoose';
import { User, ISubscription } from '../models/User';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import { PaymentService } from './paymentService';
import { CinetPayService } from './cinetpayService';

interface PaymentInitiationData {
  type: 'etudiant' | 'annonceur' | 'recruteur';
  customer_name: string;
  customer_surname: string;
  customer_email: string;
  customer_phone_number: string;
  userId: string;
}

export class SubscriptionService {
  private paymentService: PaymentService;
  private cinetPayService: CinetPayService;

  private readonly SUBSCRIPTION_PRICES = {
    etudiant: 1000,    // 1,000 FCFA / mois
    annonceur: 5000,   // 5,000 FCFA / mois
    recruteur: 9000    // 9,000 FCFA / mois
  };

  private readonly SUBSCRIPTION_DURATION = 30; // 30 jours pour tous les types

  constructor() {
    this.paymentService = new PaymentService();
    this.cinetPayService = new CinetPayService();
  }

  async initiateSubscription(data: PaymentInitiationData) {
    try {
      const user = await User.findById(data.userId);
      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      if (user.role === 'admin') {
        throw new AppError('Les administrateurs n\'ont pas besoin d\'abonnement', 400);
      }

      const amount = this.SUBSCRIPTION_PRICES[data.type];

      const paymentData = {
        amount,
        customer_name: data.customer_name,
        customer_surname: data.customer_surname,
        customer_email: data.customer_email,
        customer_phone_number: data.customer_phone_number,
        description: `Abonnement ${data.type} BusinessConnect - 30 jours`
      };

      const payment = await this.cinetPayService.createPayment({
        amount: paymentData.amount,
        currency: 'XOF',
        description: paymentData.description,
        return_url: `${process.env.FRONTEND_URL}/subscription/confirm`,
        cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
        trans_id: `SUB_${Date.now()}_${data.userId}`,
        customer_name: `${data.customer_name} ${data.customer_surname}`,
        customer_email: data.customer_email
      });

      if (!payment.success) {
        throw new AppError('Échec de l\'initialisation du paiement', 400);
      }

      logger.info('Paiement initié:', {
        userId: data.userId,
        type: data.type,
        amount,
        paymentUrl: payment.payment_url
      });

      return {
        paymentUrl: payment.payment_url
      };
    } catch (error) {
      logger.error('Erreur lors de l\'initiation de l\'abonnement:', error);
      throw error;
    }
  }

  async activateSubscription(userId: string, type: 'etudiant' | 'annonceur' | 'recruteur', paymentId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      if (user.role === 'admin') {
        throw new AppError('Les administrateurs n\'ont pas besoin d\'abonnement', 400);
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + this.SUBSCRIPTION_DURATION);

      const subscription: ISubscription = {
        type,
        status: 'active',
        startDate,
        endDate,
        paymentId
      };

      user.subscription = subscription;
      await user.save();

      logger.info('Abonnement activé:', {
        userId,
        type,
        startDate,
        endDate,
        paymentId
      });

      return {
        success: true,
        subscription
      };
    } catch (error) {
      logger.error('Erreur lors de l\'activation de l\'abonnement:', error);
      throw error;
    }
  }

  async checkSubscriptionStatus(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      // Les admins ont toujours accès
      if (user.role === 'admin') {
        return {
          isActive: true,
          type: 'admin',
          message: 'Accès administrateur illimité'
        };
      }

      if (!user.subscription) {
        return {
          isActive: false,
          message: 'Aucun abonnement trouvé'
        };
      }

      const now = new Date();
      const isExpired = user.subscription.endDate < now;

      if (isExpired) {
        user.subscription.status = 'expired';
        await user.save();

        return {
          isActive: false,
          message: 'Abonnement expiré',
          expiryDate: user.subscription.endDate
        };
      }

      return {
        isActive: true,
        type: user.subscription.type,
        expiryDate: user.subscription.endDate,
        daysRemaining: Math.ceil((user.subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      };
    } catch (error) {
      logger.error('Erreur lors de la vérification du statut de l\'abonnement:', error);
      throw error;
    }
  }
} 