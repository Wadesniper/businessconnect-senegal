import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { NotificationService } from '../services/notificationService';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hashedPassword
      });

      await user.save();

      const token = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Erreur lors de l\'inscription:', error);
      throw new AppError('Erreur lors de l\'inscription', 500);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      const token = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la connexion:', error);
      throw new AppError('Erreur lors de la connexion', 500);
    }
  },

  async forgotPassword(req: Request, res: Response) {
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
        config.JWT_SECRET,
        { expiresIn: '1h' }
      );

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 heure
      await user.save();

      const notificationService = new NotificationService();
      await notificationService.sendPasswordResetEmail(email, resetToken);

      res.status(200).json({
        success: true,
        message: 'Email de réinitialisation envoyé'
      });
    } catch (error) {
      logger.error('Erreur lors de la demande de réinitialisation:', error);
      throw new AppError('Erreur lors de la demande de réinitialisation', 500);
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password } = req.body;

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

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la réinitialisation du mot de passe:', error);
      throw new AppError('Token invalide ou expiré', 400);
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        return res.status(404).json({
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
    } catch (error) {
      logger.error('Erreur lors de la récupération du profil:', error);
      throw new AppError('Erreur lors de la récupération du profil', 500);
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndUpdate(
        req.user?.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
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
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du profil:', error);
      throw new AppError('Erreur lors de la mise à jour du profil', 500);
    }
  },

  async updatePassword(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user?.id).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      const { currentPassword, newPassword } = req.body;
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Mot de passe actuel incorrect'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Mot de passe mis à jour avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du mot de passe:', error);
      throw new AppError('Erreur lors de la mise à jour du mot de passe', 500);
    }
  },

  async deleteAccount(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndDelete(req.user?.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Compte supprimé avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression du compte:', error);
      throw new AppError('Erreur lors de la suppression du compte', 500);
    }
  },

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find().select('-password');
      res.status(200).json({
        success: true,
        users
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des utilisateurs:', error);
      throw new AppError('Erreur lors de la récupération des utilisateurs', 500);
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw new AppError('Erreur lors de la mise à jour de l\'utilisateur', 500);
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw new AppError('Erreur lors de la suppression de l\'utilisateur', 500);
    }
  }
}; 