import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '../services/subscriptionService.js';

const subscriptionService = new SubscriptionService();

export const checkSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id; // Assurez-vous que req.user est défini par votre auth middleware

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Utilisateur non authentifié',
      });
    }

    const userRole = req.user?.role;
    const hasAccess = await subscriptionService.checkSubscriptionAccess(userId, userRole);

    if (!hasAccess) {
      return res.status(403).json({
        status: 'error',
        message: 'Abonnement requis pour accéder aux formations',
      });
    }

    next();
    return;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'abonnement:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la vérification de l\'abonnement',
    });
  }
}; 