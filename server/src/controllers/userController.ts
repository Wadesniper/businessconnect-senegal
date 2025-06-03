import { Request, Response, AuthRequest } from '../types/custom.express';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { emailService } from '../services/emailService';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { UserPayload } from '../types/user';

export class UserController {
  async getPublicProfile(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpire -verificationToken');
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (error) {
      logger.error('Erreur lors de la récupération du profil public:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du profil public' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const updates = req.body;
      const user = await User.findByIdAndUpdate(
        req.user?.id,
        { $set: updates },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndDelete(req.user?.id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la suppression du compte:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression du compte' });
    }
  }

  async getPreferences(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const user = await User.findById(userId).select('preferences');
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json(user.preferences);
    } catch (error) {
      logger.error('Erreur lors de la récupération des préférences:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des préférences' });
    }
  }

  async updatePreferences(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { preferences: req.body },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json(user.preferences);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour des préférences:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour des préférences' });
    }
  }

  async getNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const user = await User.findById(userId).select('notifications');
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json(user.notifications);
    } catch (error) {
      logger.error('Erreur lors de la récupération des notifications:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
    }
  }

  async updateNotification(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const notificationId = req.params.id;
      const user = await User.findOneAndUpdate(
        { _id: userId, 'notifications._id': notificationId },
        { 'notifications.$.read': true },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'Notification non trouvée' });
      }

      res.json({ message: 'Notification mise à jour avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de la notification:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la notification' });
    }
  }

  async deleteNotification(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const notificationId = req.params.id;
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { notifications: { _id: notificationId } } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'Notification non trouvée' });
      }

      res.json({ message: 'Notification supprimée avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la suppression de la notification:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de la notification' });
    }
  }

  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpire -verificationToken');
      res.json(users);
    } catch (error) {
      logger.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
  }

  async getUserById(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpire -verificationToken');
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json(user);
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
  }

  async updateUserStatus(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const { status } = req.body;
      const userId = req.params.id;

      const user = await User.findByIdAndUpdate(
        userId,
        { status },
        { new: true }
      ).select('-password -resetPasswordToken -resetPasswordExpire -verificationToken');

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json(user);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
  }

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const userId = req.params.id;
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role
      });

      const payload: UserPayload = {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      };

      const token = generateToken(payload);

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const payload: UserPayload = {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      };

      const token = generateToken(payload);

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la connexion:', error);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const payload: UserPayload = {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      };

      const resetToken = generateToken(payload, '1h');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      await emailService.sendResetPasswordEmail(email, resetToken);

      res.json({ message: 'Email de réinitialisation envoyé' });
    } catch (error) {
      logger.error('Erreur lors de la demande de réinitialisation:', error);
      res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ error: 'Token invalide ou expiré' });
      }

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la réinitialisation:', error);
      res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' });
    }
  }
} 