import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { UserPayload } from '../types/user';

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Erreur d\'authentification:', error);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    next();
  } catch (error) {
    logger.error('Erreur de vérification admin:', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}; 