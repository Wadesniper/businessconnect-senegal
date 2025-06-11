import { Request, Response } from 'express';
import { AuthRequest, NextFunction } from '../types/custom.express.js';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config.js';
import { NotificationService } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';
import { validatePhoneNumber } from '../utils/validation.js';
import prisma from '../config/prisma.js';

export class AuthController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService({ daysBeforeExpiration: [] });
  }

  register = async (req: Request, res: Response, next?: NextFunction) => {
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
          message: "Le numéro doit être au format international. Exemples : +221 7X XXX XX XX (Sénégal), +33 X XX XX XX XX (France), etc."
        });
      }

      // Vérifier si l'utilisateur existe déjà (Prisma)
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { phoneNumber: normalizedPhone },
            ...(email ? [{ email: email.toLowerCase() }] : [])
          ]
        }
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

      // Créer le nouvel utilisateur (Prisma)
      const user = await prisma.user.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: normalizedPhone,
          password: hashedPassword,
          isVerified: false,
          role: 'pending',
          name: `${firstName.trim()} ${lastName.trim()}`,
          ...(email && { email: email.toLowerCase() })
        }
      });

      // Générer le token JWT
      const token = this.generateToken(user);

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
            id: user.id,
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

  login = async (req: Request, res: Response, next?: NextFunction) => {
    try {
      const { phoneNumber, password } = req.body;

      // Log pour diagnostic
      logger.info('[AUTH][LOGIN] Tentative de connexion', {
        phoneNumber: phoneNumber ? 'présent' : 'manquant',
        password: password ? 'présent' : 'manquant'
      });

      // Validation des champs requis
      if (!phoneNumber || !password) {
        logger.warn('[AUTH][LOGIN] Champs manquants', { phoneNumber: !!phoneNumber, password: !!password });
        return res.status(400).json({
          success: false,
          message: 'Le numéro de téléphone et le mot de passe sont requis'
        });
      }

      // Validation et normalisation du numéro de téléphone
      const normalizedPhone = validatePhoneNumber(phoneNumber);
      logger.info('[AUTH][LOGIN] Numéro normalisé', { original: phoneNumber, normalized: normalizedPhone });
      
      if (!normalizedPhone) {
        logger.warn('[AUTH][LOGIN] Numéro non valide', { phoneNumber });
        return res.status(400).json({
          success: false,
          message: "Le numéro doit être au format international. Exemples : +221 7X XXX XX XX (Sénégal), +33 X XX XX XX XX (France), etc."
        });
      }

      // Rechercher l'utilisateur (Prisma)
      const user = await prisma.user.findUnique({
        where: { phoneNumber: normalizedPhone },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          role: true,
          password: true,
          isVerified: true
        }
      });

      logger.info('[AUTH][LOGIN] Recherche utilisateur', { 
        found: !!user,
        userId: user?.id,
        role: user?.role
      });

      if (!user) {
        logger.warn('[AUTH][LOGIN] Utilisateur non trouvé', { phoneNumber: normalizedPhone });
        return res.status(401).json({
          success: false,
          message: 'Numéro de téléphone ou mot de passe incorrect'
        });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      logger.info('[AUTH][LOGIN] Vérification mot de passe', { valid: isPasswordValid });

      if (!isPasswordValid) {
        logger.warn('[AUTH][LOGIN] Mot de passe invalide', { userId: user.id });
        return res.status(401).json({
          success: false,
          message: 'Numéro de téléphone ou mot de passe incorrect'
        });
      }

      // Vérifier si l'utilisateur est vérifié
      if (!user.isVerified) {
        logger.warn('[AUTH][LOGIN] Utilisateur non vérifié', { userId: user.id });
        return res.status(403).json({
          success: false,
          message: 'Veuillez vérifier votre numéro de téléphone avant de vous connecter'
        });
      }

      // Générer le token JWT
      const token = this.generateToken(user);
      logger.info('[AUTH][LOGIN] Token généré', { userId: user.id });

      // Préparer la réponse
      const { password: _, ...userWithoutPassword } = user;
      const response = {
        success: true,
        message: 'Connexion réussie',
        data: {
          token,
          user: userWithoutPassword
        }
      };

      logger.info('[AUTH][LOGIN] Connexion réussie', { userId: user.id });
      res.json(response);

    } catch (error) {
      logger.error('[AUTH][LOGIN] Erreur serveur', { error });
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la connexion'
      });
    }
  };

  verifyEmail = async (req: Request, res: Response, next?: NextFunction) => {
    try {
      const { token } = req.params;

      // Vérifier le token
      const decodedEmail = jwt.verify(token, config.JWT_SECRET as Secret) as { id: string };
      const user = await prisma.user.findUnique({
        where: { id: decodedEmail.id }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token invalide'
        });
      }

      // Mettre à jour le statut de vérification
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true
        }
      });

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

  forgotPassword = async (req: Request, res: Response, next?: NextFunction) => {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Aucun compte associé à cet email'
        });
      }

      // Générer le token de réinitialisation
      const signOptions: SignOptions = { expiresIn: '7d' };
      const resetToken = jwt.sign(
        { id: user.id },
        config.JWT_SECRET as Secret,
        signOptions
      );

      // Sauvegarder le token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordExpire: new Date(Date.now() + 24 * 3600000) // 24 heures
        }
      });

      // Envoyer l'email de réinitialisation
      await this.notificationService.sendPasswordResetEmail(email, resetToken);

      res.status(200).json({
        success: true,
        message: 'Email de réinitialisation envoyé'
      });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi de l\'email de réinitialisation'
      });
    }
  };

  resetPassword = async (req: Request, res: Response, next?: NextFunction) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      // Vérifier le token
      const decodedReset = jwt.verify(token, config.JWT_SECRET as Secret) as { id: string };
      const user = await prisma.user.findUnique({
        where: { id: decodedReset.id }
      });

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
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpire: null
        }
      });

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

  verifyToken = async (req: Request, res: Response, next?: NextFunction) => {
    try {
      const { token } = req.params;

      // Vérifier le token
      const decodedVerify = jwt.verify(token, config.JWT_SECRET as Secret) as { id: string };
      const user = await prisma.user.findUnique({
        where: { id: decodedVerify.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true
        }
      });

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
          user
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification du token:', error);
      res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
  };

  // Générer le token JWT
  private generateToken(user: any): string {
    const payload = {
      id: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role
    };

    const signOptions: SignOptions = {
      expiresIn: '7d'
    };

    return jwt.sign(payload, config.JWT_SECRET as Secret, signOptions);
  }

  getCurrentUser = async (req: AuthRequest, res: Response, next?: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié ou utilisateur non trouvé dans le token'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          role: true,
          isVerified: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé en base de données'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error("Erreur lors de la récupération de l'utilisateur courant:", error);
      if (next) next(error);
      else res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  updateProfile = async (req: AuthRequest, res: Response, next?: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié ou utilisateur non trouvé dans le token'
        });
      }

      const userId = req.user.id;
      const updates = req.body;
      
      // Supprimer les champs protégés
      delete updates.password;
      delete updates.role;
      delete updates.isVerified;
      delete updates.email;
      delete updates.phoneNumber;

      const user = await prisma.user.update({
        where: { id: userId },
        data: updates,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          role: true,
          isVerified: true
        }
      });

      res.status(200).json({
        success: true,
        message: 'Profil mis à jour avec succès',
        data: user
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du profil:', error);
      if (next) next(error);
      else res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };
} 