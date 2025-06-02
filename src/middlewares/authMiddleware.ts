import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser } from '../models/User';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Liste des routes publiques qui ne nécessitent pas d'authentification
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-email',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/marketplace/items',
  '/api/marketplace/search',
];

class AuthMiddleware {
  public authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Vérifier si la route est publique
      const isPublicRoute = PUBLIC_ROUTES.some(route => req.path.startsWith(route));
      if (isPublicRoute) {
        return next();
      }

      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token d\'authentification manquant'
        });
      }

      const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      logger.error('Erreur d\'authentification:', error);
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
  };

  public isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
      }
      next();
    } catch (error) {
      logger.error('Erreur de vérification admin:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  };
}

export const authMiddleware = new AuthMiddleware(); 