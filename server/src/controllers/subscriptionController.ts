import { Request, Response, AuthRequest } from '../types/custom.express.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import { SubscriptionService } from '../services/subscriptionService.js';

interface InitiateSubscriptionRequest {
  userId: string;
  subscriptionType: 'etudiant' | 'annonceur' | 'recruteur';
  customer_name: string;
  customer_surname: string;
  customer_email: string;
  customer_phone_number: string;
}

export class SubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  async initiateSubscription(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    try {
      const {
        subscriptionType,
        customer_name,
        customer_surname,
        customer_email,
        customer_phone_number
      } = authReq.body as InitiateSubscriptionRequest;

      const missingParams: string[] = [];

      if (!authReq.user?.id) missingParams.push('userId');
      if (!subscriptionType) missingParams.push('subscriptionType');
      if (!customer_name) missingParams.push('customer_name');
      if (!customer_surname) missingParams.push('customer_surname');
      if (!customer_phone_number) missingParams.push('customer_phone_number');

      if (missingParams.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Paramètres manquants : ${missingParams.join(', ')}`
        });
      }

      const result = await this.subscriptionService.initiateSubscription({
        type: subscriptionType,
        customer_name,
        customer_surname,
        customer_email,
        customer_phone_number,
        userId: authReq.user!.id
      });

      res.json({
        success: true,
        paymentUrl: result.paymentUrl
      });
    } catch (error) {
      logger.error('Erreur lors de l\'initiation de l\'abonnement:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  async activateSubscription(req: Request, res: Response) {
    try {
      const { userId, subscriptionType, paymentId } = req.body;

      if (!userId || !subscriptionType || !paymentId) {
        return res.status(400).json({
          success: false,
          message: 'userId, subscriptionType et paymentId sont requis'
        });
      }

      const result = await this.subscriptionService.activateSubscription(
        userId,
        paymentId 
      );

      res.json(result);
    } catch (error) {
      logger.error('Erreur lors de l\'activation de l\'abonnement:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  async checkSubscriptionStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId est requis'
        });
      }

      const status = await this.subscriptionService.checkSubscriptionStatus(userId);
      res.json(status);
    } catch (error) {
      logger.error('Erreur lors de la vérification du statut de l\'abonnement:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

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