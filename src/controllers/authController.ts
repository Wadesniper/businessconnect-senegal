import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../businessconnect-senegal/server/src/models/UserModel';
import { config } from '../config';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || config.jwt.secret;

export class AuthController {
  constructor() {}

  register = async (req: Request, res: Response) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        role,
        company
      } = req.body;

      // Validation du rôle
      if (!['admin', 'etudiant', 'annonceur', 'employeur'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Type de compte invalide'
        });
      }

      // Vérification de l'email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }

      // Validation des données spécifiques au rôle
      if ((role === 'employeur' || role === 'annonceur') && !company) {
        return res.status(400).json({
          success: false,
          message: 'Les informations de l\'entreprise sont requises'
        });
      }

      // Hashage du mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Création de l'utilisateur
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
        company,
        isVerified: true,
        settings: {
          notifications: true,
          newsletter: true,
          language: 'fr',
          theme: 'light'
        }
      });

      await user.save();

      // Création du token d'authentification (connexion automatique)
      const authToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          isVerified: true
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: {
          token: authToken,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: `${user.firstName} ${user.lastName}`,
            role: user.role,
            isVerified: true,
            phoneNumber: user.phoneNumber,
            company: user.company,
            settings: user.settings
          }
        }
      });
    } catch (error) {
      logger.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'inscription'
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Mise à jour de la dernière connexion
      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          isVerified: true
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Connexion réussie',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: `${user.firstName} ${user.lastName}`,
            role: user.role,
            isVerified: true,
            phoneNumber: user.phoneNumber,
            company: user.company,
            settings: user.settings,
            lastLogin: user.lastLogin
          }
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la connexion'
      });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Aucun compte associé à cet email'
        });
      }

      const resetToken = jwt.sign(
        { id: user._id },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure
      await user.save();

      // Ici, nous devrons implémenter l'envoi d'email de réinitialisation
      // Pour l'instant, nous retournons juste le token
      res.json({
        success: true,
        message: 'Instructions de réinitialisation envoyées par email',
        resetToken // À supprimer en production
      });
    } catch (error) {
      logger.error('Erreur lors de la demande de réinitialisation:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue'
      });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token invalide ou expiré'
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la réinitialisation du mot de passe:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue'
      });
    }
  };
} 