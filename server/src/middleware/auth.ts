import { Request, Response, NextFunction, AuthRequest } from '../types/express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { UserPayload } from '../types/express';
import { config } from '../config';
import { User } from '../models/User';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Vérifier le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || (typeof authHeader === 'string' && !authHeader.startsWith('Bearer '))) {
      res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant'
      });
      return;
    }

    // Extraire et vérifier le token
    const token = typeof authHeader === 'string' ? authHeader.split(' ')[1] : '';
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };

    // Vérifier l'utilisateur
    const user = await User.findById(decoded.id).select('+isVerified +role +firstName +lastName +phoneNumber +email');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
      return;
    }

    // Vérifier si l'utilisateur est vérifié
    if (!user.isVerified) {
      res.status(401).json({
        success: false,
        message: 'Veuillez vérifier votre email'
      });
      return;
    }

    // Ajouter l'utilisateur à la requête avec toutes les propriétés nécessaires
    const userPayload: UserPayload = {
      id: user._id.toString(),
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      isVerified: user.isVerified
    };

    (req as AuthRequest).user = userPayload;

    next();
  } catch (error) {
    logger.error('Erreur d\'authentification:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
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

export { authenticate as default }; 