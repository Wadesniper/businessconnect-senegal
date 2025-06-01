import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserPayload } from '../types/user';
import jwtConfig from '../config/jwt';
import { logger } from '../utils/logger';
import { User } from '../models/User';

const JWT_SECRET = 'fc5c01210b133afeb2c293bfd28c59df3bb9d3b272999be0eb838c930b1419fd';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
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
      email: user.email
    };

    // Ajouter l'utilisateur à la requête
    req.user = userPayload;
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