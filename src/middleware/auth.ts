import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser } from '../models/User';
import { AppError } from '../utils/appError';

// Déclaration de module pour étendre la définition de Express
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string;
      phone: string;
      role: 'admin' | 'etudiant' | 'annonceur' | 'employeur';
    };
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Vous n\'êtes pas connecté', 401));
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new AppError('L\'utilisateur n\'existe plus', 401));
    }

    // Transformer l'utilisateur en format attendu par req.user
    req.user = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    next();
  } catch (error) {
    next(new AppError('Token invalide', 401));
  }
};

export const restrictTo = (...roles: IUser['role'][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Vous n\'êtes pas connecté', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Vous n\'avez pas la permission d\'effectuer cette action', 403));
    }

    next();
  };
}; 