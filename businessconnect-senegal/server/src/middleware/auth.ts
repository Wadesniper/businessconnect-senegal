import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { UserPayload } from '../types/user';

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Exclure les routes d'authentification
    if (req.path.startsWith('/api/auth/')) {
      next();
      return;
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Token d\'authentification manquant' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as UserPayload;
    req.user = decoded;
    next();
    return;
  } catch (error) {
    logger.error('Erreur d\'authentification:', error);
    res.status(401).json({ error: 'Token invalide ou expiré' });
    return;
  }
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Utilisateur non authentifié' });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({ error: 'Accès non autorisé' });
      return;
    }

    next();
    return;
  } catch (error) {
    logger.error('Erreur de vérification admin:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
    return;
  }
}; 