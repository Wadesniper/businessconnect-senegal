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
      const { name, email, phone, password } = req.body;
      // Normalisation du téléphone
      function normalizePhone(phone: string): string | null {
        if (!phone) return null;
        
        // Nettoie le numéro en gardant uniquement les chiffres et le +
        let cleaned = phone.replace(/[^\\d+]/g, '');
        
        // Si le numéro commence par +, c'est déjà au format international
        if (cleaned.startsWith('+')) {
          // Vérifie que le numéro a une longueur valide (indicatif + 8 chiffres minimum)
          if (cleaned.length >= 10) return cleaned;
          return null;
        }
        
        // Si c'est un numéro sénégalais (commence par 7 et a 9 chiffres)
        if (/^7\\d{8}$/.test(cleaned)) {
          return '+221' + cleaned;
        }
        
        return null;
      }
      const normalizedPhone = normalizePhone(phone);
      if (!normalizedPhone) {
        return res.status(400).json({
          success: false,
          message: "Merci d'entrer votre numéro au format international (ex : +221770000000 ou +33612345678)."
        });
      }
      // Vérifier si l'utilisateur existe déjà par téléphone
      const existingUser = await User.findOne({ phone: normalizedPhone });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec ce numéro de téléphone existe déjà'
        });
      }
      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // Créer le nouvel utilisateur
      const user = new User({
        name,
        email,
        phone: normalizedPhone,
        password: hashedPassword
      });
      await user.save();
      // Générer le token de vérification
      const jwtSecret: any = process.env.JWT_SECRET || 'default_secret';
      const jwtExpire: any = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '30d';
      const options: jwt.SignOptions = { expiresIn: jwtExpire };
      const verificationToken = jwt.sign(
        { id: user._id },
        jwtSecret,
        options
      );
      // Envoyer l'email de vérification si email fourni
      if (email) {
        await this.notificationService.sendVerificationEmail(email, verificationToken);
      }
      res.status(201).json({
        success: true,
        message: 'Inscription réussie. Veuillez vérifier votre email si vous en avez fourni un.'
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
      // Accepte 'phone' ou 'phoneNumber' pour compatibilité frontend
      const phone = req.body.phone || req.body.phoneNumber;
      const { password } = req.body;
      // Normalisation du téléphone
      function normalizePhone(phone: string): string | null {
        if (!phone) return null;
        
        // Nettoie le numéro en gardant uniquement les chiffres et le +
        let cleaned = phone.replace(/[^\\d+]/g, '');
        
        // Si le numéro commence par +, c'est déjà au format international
        if (cleaned.startsWith('+')) {
          // Vérifie que le numéro a une longueur valide (indicatif + 8 chiffres minimum)
          if (cleaned.length >= 10) return cleaned;
          return null;
        }
        
        // Si c'est un numéro sénégalais (commence par 7 et a 9 chiffres)
        if (/^7\\d{8}$/.test(cleaned)) {
          return '+221' + cleaned;
        }
        
        return null;
      }
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Le numéro de téléphone est requis pour la connexion.'
        });
      }
      const normalizedPhone = normalizePhone(phone);
      if (!normalizedPhone) {
        return res.status(400).json({
          success: false,
          message: "Merci d'entrer votre numéro au format international (ex : +221770000000 ou +33612345678)."
        });
      }
      const user = await User.findOne({ phone: normalizedPhone }).select('+password');
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
        { id: user._id },
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
            name: user.name,
            email: user.email,
            phone: user.phone,
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
      logger.error('Erreur lors de la demande de réinitialisation:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue'
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
      const user = await User.findOne({
        _id: decoded.id,
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
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
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
      return;
    } catch (error) {
      logger.error('Erreur lors de la vérification du token:', error);
      res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
      return;
    }
  };
} 