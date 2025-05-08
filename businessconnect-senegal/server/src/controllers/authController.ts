import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { logger } from '../utils/logger';

const secret: Secret = config.JWT_SECRET;

export class AuthController {
  constructor() {}

  register = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }

      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Créer le nouvel utilisateur
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword
      });

      await user.save();

      // Générer le token de vérification
      const verificationToken = jwt.sign(
        { id: (user as any)._id },
        secret,
        { expiresIn: '24h' }
      );

      // Ici tu peux envoyer un email de vérification si tu veux, sinon tu peux ignorer

      res.status(201).json({
        success: true,
        message: 'Inscription réussie. Veuillez vérifier votre email.'
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

      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, (user as any).password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier si l'email est vérifié
      if (!(user as any).isVerified) {
        return res.status(401).json({
          success: false,
          message: 'Veuillez vérifier votre email avant de vous connecter'
        });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { id: (user as any)._id },
        secret,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          id: (user as any)._id,
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
          email: (user as any).email,
          role: (user as any).role
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

  verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      // Vérifier le token
      const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token invalide'
        });
      }

      // Mettre à jour le statut de vérification
      (user as any).isVerified = true;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Email vérifié avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification de l\'email:', error);
      res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
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
        { id: (user as any)._id },
        secret,
        { expiresIn: '1h' }
      );

      // Sauvegarder le token
      (user as any).resetPasswordToken = resetToken;
      (user as any).resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure
      await user.save();

      // Envoyer l'email de réinitialisation
      // Ici tu peux envoyer un email de réinitialisation si tu veux, sinon tu peux ignorer

      res.status(200).json({
        success: true,
        message: 'Email de réinitialisation envoyé'
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
      const { token } = req.params;
      const { password } = req.body;

      // Vérifier le token
      const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
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

      // Hasher le nouveau mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Mettre à jour le mot de passe
      (user as any).password = hashedPassword;
      (user as any).resetPasswordToken = undefined;
      (user as any).resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la réinitialisation du mot de passe:', error);
      res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
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