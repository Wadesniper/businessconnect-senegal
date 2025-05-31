import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { NotificationService } from '../services/notificationService';
import { logger } from '../utils/logger';

export class AuthController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService({ daysBeforeExpiration: [] });
  }

  register = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, phoneNumber, password } = req.body;

      // Validation des champs requis
      if (!firstName || !lastName || !phoneNumber || !password) {
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
      if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Format d\'email invalide'
        });
      }

      // Normalisation du téléphone
      function normalizePhone(phone: string): string | null | 'INVALID_PREFIX' {
        if (!phone) return null;
        
        // Nettoie le numéro en gardant uniquement les chiffres et le +
        let cleaned = phone.replace(/[^0-9+]/g, '');
        
        // Si le numéro commence par +, c'est déjà au format international
        if (cleaned.startsWith('+')) {
          // Vérifie que le numéro a une longueur valide (indicatif + 8 chiffres minimum)
          if (cleaned.length >= 10) return cleaned;
          return null;
        }
        
        // Si le numéro commence par 77, 78, ou 76 (numéros sénégalais)
        if (/^(77|78|76|70)\d{7}$/.test(cleaned)) {
          return '+221' + cleaned;
        }
        
        // Si le numéro commence par un autre préfixe sénégalais
        if (/^7\d{8}$/.test(cleaned)) {
          return 'INVALID_PREFIX';
        }
        
        return null;
      }

      // Nettoyer et valider le numéro de téléphone
      const normalizedPhone = normalizePhone(phoneNumber);
      if (normalizedPhone === 'INVALID_PREFIX') {
        return res.status(400).json({
          success: false,
          message: "Le numéro de téléphone doit commencer par 70, 76, 77 ou 78 pour les numéros sénégalais"
        });
      }
      if (!normalizedPhone) {
        return res.status(400).json({
          success: false,
          message: "Le numéro de téléphone doit être au format international (+221 77 XXX XX XX) ou sénégalais (77 XXX XX XX)"
        });
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ phoneNumber: normalizedPhone });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec ce numéro de téléphone existe déjà'
        });
      }

      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Créer le nouvel utilisateur avec le numéro normalisé
      const userData: any = {
        firstName,
        lastName,
        phoneNumber: normalizedPhone,
        password: hashedPassword
      };

      if (email) {
        userData.email = email;
      }

      const user = new User(userData);

      await user.save();
      
      // Générer le token JWT pour la connexion immédiate
      const jwtSecret: any = process.env.JWT_SECRET || 'default_secret';
      const jwtExpire: any = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '30d';
      const options: jwt.SignOptions = { expiresIn: jwtExpire };
      const token = jwt.sign(
        { 
          id: user._id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        },
        jwtSecret,
        options
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

      // Renvoyer le token avec la réponse pour permettre la connexion immédiate
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
            role: user.role
          }
        }
      });
      return;
    } catch (error) {
      logger.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'inscription'
      });
      return;
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { phoneNumber, password } = req.body;
      
      // Normalisation du téléphone
      function normalizePhone(phone: string): string | null {
        if (!phone) return null;
        
        // Nettoie le numéro en gardant uniquement les chiffres et le +
        let cleaned = phone.replace(/[^0-9+]/g, '');
        
        // Si le numéro commence par +, c'est déjà au format international
        if (cleaned.startsWith('+')) {
          // Vérifie que le numéro a une longueur valide (indicatif + 8 chiffres minimum)
          if (cleaned.length >= 10) return cleaned;
          return null;
        }
        
        // Si c'est un numéro sénégalais (commence par 7 et a 9 chiffres)
        if (/^7\d{8}$/.test(cleaned)) {
          return '+221' + cleaned;
        }
        
        return null;
      }
      if (!phoneNumber) {
        return res.status(400).json({
          success: false,
          message: 'Le numéro de téléphone est requis pour la connexion.'
        });
      }
      const normalizedPhone = normalizePhone(phoneNumber);
      if (!normalizedPhone) {
        return res.status(400).json({
          success: false,
          message: "Merci d'entrer votre numéro au format international (ex : +221770000000 ou +33612345678)."
        });
      }
      const user = await User.findOne({ phoneNumber: normalizedPhone }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Numéro de téléphone ou mot de passe incorrect'
        });
      }
      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Numéro de téléphone ou mot de passe incorrect'
        });
      }
      // Générer le token JWT
      const jwtSecret: any = process.env.JWT_SECRET || 'default_secret';
      const jwtExpire: any = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '30d';
      const options: jwt.SignOptions = { expiresIn: jwtExpire };
      const token = jwt.sign(
        { 
          id: user._id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        },
        jwtSecret,
        options
      );
      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: {
          token,
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
      logger.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la connexion'
      });
      return;
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
      const jwtSecret: any = process.env.JWT_SECRET || 'default_secret';
      const jwtExpire: any = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '30d';
      const options: jwt.SignOptions = { expiresIn: jwtExpire };
      const resetToken = jwt.sign(
        { id: user._id },
        jwtSecret,
        options
      );

      // Sauvegarder le token
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 heure
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
      const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
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
      const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
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