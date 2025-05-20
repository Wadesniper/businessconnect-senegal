import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { AuthRequest } from '../types/user';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Vérifier le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant'
      });
      return;
    }

    // Extraire et vérifier le token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };

    // Vérifier l'utilisateur
    const user = await User.findById(decoded.id);
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

    // Ajouter l'utilisateur à la requête
    req.user = {
      id: user._id.toString(),
      email: user.email || '',
      role: user.role
    };

    next();
    return;
  } catch (error) {
    logger.error('Erreur d\'authentification:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
    return;
  }
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Accès refusé' });
      return;
    }
    next();
    return;
  } catch (error) {
    logger.error('Erreur de vérification admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
    return;
  }
}; 