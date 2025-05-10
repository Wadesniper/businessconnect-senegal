import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/UserModel';
import { config } from '../config';
import { logger } from '../utils/logger';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';

const secret: Secret = config.JWT_SECRET;
const ALLOWED_ROLES = ['admin', 'etudiant', 'annonceur', 'employeur'];

export class AuthController {
  constructor() {}

  register = async (req: Request, res: Response) => {
    try {
      const {
        fullName,
        email,
        password,
        phoneNumber,
        company
      } = req.body;

      // Validation des champs obligatoires
      if (!fullName || !phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nom complet, téléphone et mot de passe sont obligatoires.'
        });
      }

      // Vérification de l'unicité du téléphone ou de l'email
      const existingUser = await User.findOne({
        $or: [
          { phoneNumber },
          ...(email ? [{ email }] : [])
        ]
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Ce téléphone ou cet email est déjà utilisé'
        });
      }

      // Création de l'utilisateur
      const user = new User({
        fullName,
        email,
        password,
        phoneNumber,
        role: 'utilisateur', // Rôle par défaut
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

      // Création du token d'authentification
      const authToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        secret,
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
            fullName: user.fullName,
            role: user.role,
            isVerified: user.isVerified,
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

  verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const decoded = jwt.verify(token, secret) as { email: string };
      const user = await User.findOne({ email: decoded.email, verificationToken: token });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token de vérification invalide ou expiré'
        });
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Email vérifié avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification de l\'email:', error);
      res.status(400).json({
        success: false,
        message: 'Token de vérification invalide ou expiré'
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          message: 'Identifiant (téléphone ou nom complet) et mot de passe sont obligatoires'
        });
      }

      // Recherche de l'utilisateur par numéro de téléphone ou nom complet
      const user = await User.findOne({
        $or: [
          { phoneNumber: identifier },
          { fullName: identifier }
        ]
      }).select('+password');

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Identifiant ou mot de passe incorrect'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Identifiant ou mot de passe incorrect'
        });
      }

      // Mise à jour de la dernière connexion
      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        {
          id: user._id,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isVerified: user.isVerified
        },
        secret,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: {
          token,
          user: {
            id: user._id,
            phoneNumber: user.phoneNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            role: user.role,
            isVerified: user.isVerified,
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

      // Générer le token de réinitialisation
      const resetToken = jwt.sign(
        { id: user._id },
        secret,
        { expiresIn: '1h' }
      );

      // Sauvegarder le token
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure
      await user.save();

      // Envoyer l'email de réinitialisation
      await sendPasswordResetEmail(email, resetToken);

      res.json({
        success: true,
        message: 'Un email de réinitialisation a été envoyé'
      });
    } catch (error) {
      logger.error('Erreur lors de la demande de réinitialisation:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la demande de réinitialisation'
      });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: 'Token et nouveau mot de passe sont requis'
        });
      }

      // Vérifier le token
      const decoded = jwt.verify(token, secret) as { id: string };
      const user = await User.findOne({
        _id: decoded.id,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token invalide ou expiré'
        });
      }

      // Mettre à jour le mot de passe
      user.password = password;
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
        message: 'Une erreur est survenue lors de la réinitialisation du mot de passe'
      });
    }
  };

  verifyToken = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token non fourni'
        });
      }

      const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        user: {
          id: (user as any)._id,
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
          email: (user as any).email,
          role: (user as any).role
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification du token:', error);
      res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
  };
}