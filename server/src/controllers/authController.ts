import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { NotificationService } from '../services/notificationService';
import { logger } from '../utils/logger';
import { validatePhoneNumber } from '../utils/validation';
import jwtConfig from '../config/jwt';

export class AuthController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService({ daysBeforeExpiration: [] });
  }

  register = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, phoneNumber, password } = req.body;

      // Validation des champs requis
      if (!firstName?.trim() || !lastName?.trim() || !phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez remplir tous les champs obligatoires (prénom, nom, téléphone, mot de passe)'
        });
      }

      // Validation de la longueur du mot de passe
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe doit contenir au moins 6 caractères'
        });
      }

      // Validation du format de l'email si fourni
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Format d\'email invalide'
        });
      }

      // Validation et normalisation du numéro de téléphone
      const normalizedPhone = validatePhoneNumber(phoneNumber);
      if (!normalizedPhone) {
        return res.status(400).json({
          success: false,
          message: "Le numéro de téléphone doit être au format international (+221 7X XXX XX XX) ou sénégalais (7X XXX XX XX) et commencer par 70, 76, 77 ou 78"
        });
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({
        $or: [
          { phoneNumber: normalizedPhone },
          ...(email ? [{ email: email.toLowerCase() }] : [])
        ]
      });

      if (existingUser) {
        const field = existingUser.phoneNumber === normalizedPhone ? 'numéro de téléphone' : 'email';
        return res.status(400).json({
          success: false,
          message: `Un utilisateur avec ce ${field} existe déjà`
        });
      }

      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Créer le nouvel utilisateur
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: normalizedPhone,
        password: hashedPassword,
        isVerified: false,
        role: 'user',
        ...(email && { email: email.toLowerCase() })
      };

      const user = new User(userData);

      try {
        await user.save();
      } catch (dbError: any) {
        logger.error('Erreur lors de la sauvegarde de l\'utilisateur:', dbError);
        
        if (dbError.name === 'ValidationError') {
          return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors: Object.values(dbError.errors).map((err: any) => err.message)
          });
        }
        
        if (dbError.code === 11000) {
          const field = Object.keys(dbError.keyPattern)[0];
          return res.status(400).json({
            success: false,
            message: `Un utilisateur avec ce ${field === 'phoneNumber' ? 'numéro de téléphone' : 'email'} existe déjà`
          });
        }
        
        throw dbError;
      }
      
      // Générer le token JWT
      const token = jwt.sign(
        { 
          id: user._id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber
        },
        jwtConfig.secret,
        jwtConfig.signOptions
      );

      // Envoyer l'email de vérification si email fourni
      if (email) {
        try {
          await this.notificationService.sendVerificationEmail(email, token);
        } catch (emailError) {
          logger.error('Erreur lors de l\'envoi de l\'email de vérification:', emailError);
          // On continue même si l'envoi d'email échoue
        }
      }

      // Renvoyer la réponse
      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: {
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role
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
      const { phoneNumber, password } = req.body;

      // Validation des champs requis
      if (!phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: 'Le numéro de téléphone et le mot de passe sont requis'
        });
      }

      // Validation et normalisation du numéro de téléphone
      const normalizedPhone = validatePhoneNumber(phoneNumber);
      if (!normalizedPhone) {
        return res.status(400).json({
          success: false,
          message: "Format de numéro de téléphone invalide"
        });
      }

      // Rechercher l'utilisateur
      const user = await User.findOne({ phoneNumber: normalizedPhone });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Identifiants invalides'
        });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Identifiants invalides'
        });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { 
          id: user._id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber
        },
        jwtConfig.secret,
        jwtConfig.signOptions
      );

      // Renvoyer la réponse
      res.json({
        success: true,
        message: 'Connexion réussie',
        data: {
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role
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

  verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      // Vérifier le token
      const decoded = jwt.verify(token, jwtConfig.secret) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token invalide'
        });
      }

      // Mettre à jour le statut de vérification
      user.isVerified = true;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Email vérifié avec succès'
      });
      return;
    } catch (error) {
      logger.error('Erreur lors de la vérification de l\'email:', error);
      res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
      return;
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
        jwtConfig.secret,
        jwtConfig.signOptions
      );

      // Sauvegarder le token
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 24 * 3600000); // 24 heures
      await user.save();

      // Envoyer l'email de réinitialisation
      await this.notificationService.sendPasswordResetEmail(email, resetToken);

      res.status(200).json({
        success: true,
        message: 'Email de réinitialisation envoyé'
      });
      return;
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi de l\'email de réinitialisation'
      });
      return;
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      // Vérifier le token
      const decoded = jwt.verify(token, jwtConfig.secret) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token invalide'
        });
      }

      // Vérifier si le token n'a pas expiré
      if (!user.resetPasswordExpire || user.resetPasswordExpire < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Token expiré'
        });
      }

      // Hasher le nouveau mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Mettre à jour le mot de passe
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      });
      return;
    } catch (error) {
      logger.error('Erreur lors de la réinitialisation du mot de passe:', error);
      res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
      return;
    }
  };

  verifyToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      // Vérifier le token
      const decoded = jwt.verify(token, jwtConfig.secret) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token invalide'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Token valide',
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          }
        }
      });
      return;
    } catch (error) {
      logger.error('Erreur lors de la vérification du token:', error);
      res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
      return;
    }
  };
} 