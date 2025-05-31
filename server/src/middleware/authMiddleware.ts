import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserPayload } from '../types/user';
import jwtConfig from '../config/jwt';
import { logger } from '../utils/logger';
import { User } from '../models/User';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token invalide.'
      });
    }

    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as UserPayload;
      req.user = decoded;
      next();
    } catch (error) {
      logger.error('Erreur de vérification du token:', error);
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token invalide ou expiré.'
      });
    }
  } catch (error) {
    logger.error('Erreur lors de la vérification du token:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du token.'
    });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé. Privilèges administrateur requis.'
      });
    }
    next();
  } catch (error) {
    logger.error('Erreur lors de la vérification des privilèges:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des privilèges.'
    });
  }
}; 