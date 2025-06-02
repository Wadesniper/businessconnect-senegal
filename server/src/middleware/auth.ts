import { Request, Response, NextFunction, AuthRequest } from '../types/express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';
import { UserPayload, UserRole } from '../types/user';
import { logger } from '../utils/logger';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('+email +role +isVerified');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Veuillez vérifier votre compte'
      });
    }

    const userPayload: UserPayload = {
      id: user._id.toString(),
      role: user.role as UserRole,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || '',
      phoneNumber: user.phoneNumber,
      isVerified: user.isVerified
    };

    (req as AuthRequest).user = userPayload;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    logger.error('Erreur d\'authentification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'authentification'
    });
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