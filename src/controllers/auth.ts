import { Request, Response } from 'express';
import { check } from 'express-validator';
import { User } from '../models/User';
import { generateToken } from '../types/jwt';
import { config } from '../config';
import { ValidatorFunction } from '../types/express-validator';
import { AuthService } from '../services/authService';
import { NotificationService } from '../services/notificationService';
import { logger } from '../utils/logger';

export const authValidation: ValidatorFunction[] = [
  check('email').isEmail().withMessage('Email invalide'),
  check('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, phone, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }

      const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        role
      });

      const token = await AuthService.generateAuthToken(user);

      await NotificationService.sendWelcomeEmail(user);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription'
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await AuthService.validateUser(email, password);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      const token = await AuthService.generateAuthToken(user);

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion'
      });
    }
  }
}; 