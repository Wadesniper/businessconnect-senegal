import { Request, Response } from 'express';
import { check } from 'express-validator';
import { User } from '../models/User';
import { generateToken } from '../types/jwt';
import { config } from '../config';
import { ValidatorFunction } from '../types/express-validator';

export const authValidation: ValidatorFunction[] = [
  check('email').isEmail().withMessage('Email invalide'),
  check('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }

      const user = new User({
        email,
        password,
        name
      });

      await user.save();

      const token = generateToken(
        { id: user._id.toString() },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription'
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Mot de passe incorrect'
        });
      }

      const token = generateToken(
        { id: user._id.toString() },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion'
      });
    }
  }
}; 