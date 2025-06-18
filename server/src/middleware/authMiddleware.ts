import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/custom.express.js';
import { UserPayload } from '../types/user.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Vérifier si le token est présent
    const authHeader = req.headers.authorization;
    console.log('[DEBUG AUTH] Authorization header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('[DEBUG AUTH] Token extrait:', token);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
    console.log('[DEBUG AUTH] Token décodé:', decoded);
    
    // Vérifier si l'utilisateur existe avec Prisma
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user) {
      console.log('[DEBUG AUTH] Utilisateur non trouvé pour ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    console.log('[DEBUG AUTH] Utilisateur trouvé:', { id: user.id, role: user.role, email: user.email });

    // Convertir le rôle Prisma vers le type UserRole attendu
    let userRole: 'admin' | 'etudiant' | 'annonceur' | 'employeur';
    switch (user.role) {
      case 'admin':
        userRole = 'admin';
        break;
      case 'etudiant':
        userRole = 'etudiant';
        break;
      case 'annonceur':
        userRole = 'annonceur';
        break;
      case 'recruteur':
        userRole = 'employeur'; // Mapping recruteur -> employeur
        break;
      default:
        userRole = 'etudiant'; // Fallback
    }

    // Convertir le document Prisma en UserPayload
    const userPayload: UserPayload = {
      id: user.id,
      role: userRole,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email || '', // Fallback vers string vide si undefined
      isVerified: user.isVerified
    };

    // Assigner l'utilisateur à la requête
    (req as AuthRequest).user = userPayload;
    console.log('[DEBUG AUTH] User assigné à req.user:', userPayload);
    
    next();
  } catch (error) {
    console.error('[DEBUG AUTH] Erreur dans authMiddleware:', error);
    
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

    logger.error('Erreur lors de l\'authentification:', error);
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