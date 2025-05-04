import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiResponse, AuthenticatedRequest } from '../types/global';
import { UserRole } from '../types/user';

interface JwtPayload {
  id: string;
  role: UserRole;
}

export const authMiddleware = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant'
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    (req as AuthenticatedRequest).user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token d\'authentification invalide'
    });
  }
};

export const isAdmin = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    if (req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des droits'
    });
  }
}; 