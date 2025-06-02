import { Request, Response, NextFunction, AuthRequest } from '../types/express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';
import { UserPayload, UserRole } from '../types/user';
import { logger } from '../utils/logger';
import { verifyToken } from '../utils/jwt';
import { RequestHandler } from 'express';

export const authenticate: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as UserPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé. Privilèges administrateur requis.'
      });
    }
    next();
  } catch (error) {
    logger.error('Erreur de vérification admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des privilèges'
    });
  }
};

export const isEmployeur = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== 'employeur') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé. Privilèges employeur requis.'
      });
    }
    next();
  } catch (error) {
    logger.error('Erreur de vérification employeur:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des privilèges'
    });
  }
};

export const isAnnonceur = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== 'annonceur') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé. Privilèges annonceur requis.'
      });
    }
    next();
  } catch (error) {
    logger.error('Erreur de vérification annonceur:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des privilèges'
    });
  }
};

export const isEtudiant = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== 'etudiant') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé. Privilèges étudiant requis.'
      });
    }
    next();
  } catch (error) {
    logger.error('Erreur de vérification étudiant:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des privilèges'
    });
  }
};

export { authenticate as default }; 