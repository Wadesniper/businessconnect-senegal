import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { User, AuthRequest } from '../types/user';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as User;
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Erreur d\'authentification:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  } catch (error) {
    logger.error('Erreur de vérification admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 