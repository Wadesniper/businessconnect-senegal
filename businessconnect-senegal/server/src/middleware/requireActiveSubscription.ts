import { Request, Response, NextFunction } from 'express';
import { User } from '../models/UserModel';

export const requireActiveSubscription = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id).lean();
    // Si l'utilisateur est admin, il n'est pas bloqué
    if (user?.role === 'admin') {
      return next();
    }
    let subscription = user?.subscription;
    // Si c'est un tableau, prendre le premier élément
    if (Array.isArray(subscription)) {
      subscription = subscription[0];
    }
    if (!subscription || typeof subscription !== 'object' || subscription.status !== 'active' || !subscription.expireAt || new Date(subscription.expireAt) < new Date()) {
      return res.status(403).json({ message: 'Abonnement requis ou expiré.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Erreur de vérification de l\'abonnement.' });
  }
}; 