import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        error: 'Un utilisateur avec cet email existe déjà',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const jwtSecret: jwt.Secret = process.env.JWT_SECRET ? String(process.env.JWT_SECRET) : 'default_secret';
    const jwtExpire: any = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '30d';
    const options: jwt.SignOptions = { expiresIn: jwtExpire };
    const token = jwt.sign(
      { id: user._id },
      jwtSecret,
      options
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
    return;
  } catch (error) {
    logger.error('Erreur lors de l\'inscription:', error);
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides',
      });
    }

    const jwtSecret: jwt.Secret = process.env.JWT_SECRET ? String(process.env.JWT_SECRET) : 'default_secret';
    const jwtExpire: any = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '30d';
    const options: jwt.SignOptions = { expiresIn: jwtExpire };
    const token = jwt.sign(
      { id: user._id },
      jwtSecret,
      options
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
    return;
  } catch (error) {
    logger.error('Erreur lors de la connexion:', error);
    return next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Aucun utilisateur trouvé avec cet email',
      });
    }

    // TODO: Implémenter la logique d'envoi d'email de réinitialisation
    res.status(200).json({
      success: true,
      message: 'Email de réinitialisation envoyé',
    });
    return;
  } catch (error) {
    logger.error('Erreur lors de la demande de réinitialisation:', error);
    return next(error);
  }
};

export const resetPassword = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implémenter la logique de réinitialisation du mot de passe
    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
    });
    return;
  } catch (error) {
    logger.error('Erreur lors de la réinitialisation:', error);
    return next(error);
  }
}; 