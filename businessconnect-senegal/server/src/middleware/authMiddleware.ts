import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Vérifier le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant'
      });
    }

    // Extraire et vérifier le token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };

    // Vérifier l'utilisateur
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'utilisateur est vérifié
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Veuillez vérifier votre email'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    logger.error('Erreur d\'authentification:', error);
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  } catch (error) {
    logger.error('Erreur de vérification admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 