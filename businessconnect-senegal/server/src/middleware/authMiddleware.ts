import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentification requise'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET non défini');
      return res.status(500).json({
        status: 'error',
        message: 'Erreur de configuration du serveur'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 'error',
        message: 'Session expirée, veuillez vous reconnecter'
      });
    }

    logger.error('Erreur d\'authentification:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Token invalide'
    });
  }
};

const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Accès non autorisé'
    });
  }
  next();
};

export { authMiddleware, isAdmin }; 