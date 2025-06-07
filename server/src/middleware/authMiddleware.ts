import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/custom.express.js';
import { UserPayload } from '../types/user.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { User } from '../models/User.js';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Vérifier si le token est présent
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
    
    // Vérifier si l'utilisateur existe
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Convertir le document Mongoose en UserPayload
    const userPayload: UserPayload = {
      id: user._id.toString(),
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      isVerified: user.isVerified
    };

    // Maintenant, nous pouvons traiter req comme AuthRequest pour assigner user
    // et pour les middlewares/handlers suivants
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

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'authentification'
    });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Utiliser une assertion ici aussi car on s'attend à ce que authMiddleware ait été appelé avant
    if ((req as AuthRequest).user?.role !== 'admin') {
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