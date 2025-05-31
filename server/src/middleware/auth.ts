import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { UserPayload } from '../types/user';
import jwtConfig from '../config/jwt';

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Routes publiques qui ne nécessitent pas d'authentification
    if (req.path.startsWith('/auth/') || req.path.startsWith('/webhooks/')) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Accès non autorisé. Token manquant'
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Accès non autorisé. Token invalide'
      });
    }

    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as UserPayload;
      req.user = decoded;
      return next();
    } catch (jwtError) {
      logger.error('Erreur de vérification JWT:', jwtError);
      return res.status(401).json({ 
        success: false,
        message: 'Accès non autorisé. Token invalide ou expiré'
      });
    }
  } catch (error) {
    logger.error('Erreur d\'authentification:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Accès non autorisé. Droits administrateur requis.'
      });
    }

    return next();
  } catch (error) {
    logger.error('Erreur de vérification admin:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
}; 