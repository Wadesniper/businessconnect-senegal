import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { logger } from '../utils/logger';

// Déclaration de module pour étendre la définition de Express
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string;
      phone: string;
      role: 'admin' | 'etudiant' | 'annonceur' | 'employeur';
    };
  }
}

// Type pour req.user
type AuthRequest = Request;

// Type pour les mises à jour autorisées
type AllowedUpdates = Partial<Pick<IUser, 'firstName' | 'lastName' | 'email' | 'phone' | 'preferences' | 'subscription'>>;

export const userController = {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const user = await User.findById(userId)
        .select('-password -resetPasswordToken -resetPasswordExpire')
        .lean()
        .exec();

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json(user);
    } catch (error) {
      logger.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'preferences', 'subscription'] as const;
      const updates = Object.keys(req.body).reduce((acc: AllowedUpdates, key) => {
        if (allowedFields.includes(key as keyof AllowedUpdates)) {
          if (key === 'preferences' || key === 'subscription') {
            acc[key] = {
              ...req.body[key]
            };
          } else {
            (acc as any)[key] = req.body[key];
          }
        }
        return acc;
      }, {});

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { 
          new: true, 
          runValidators: true,
          select: '-password -resetPasswordToken -resetPasswordExpire'
        }
      ).lean().exec();

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json(user);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
    }
  },

  async deleteProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const user = await User.findByIdAndDelete(userId).lean().exec();
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({ message: 'Profil supprimé avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la suppression du profil:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression du profil' });
    }
  },

  async getPreferences(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const user = await User.findById(userId)
        .select('preferences')
        .lean()
        .exec();

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json(user.preferences || {});
    } catch (error) {
      logger.error('Erreur lors de la récupération des préférences:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des préférences' });
    }
  },

  async updatePreferences(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { preferences: req.body } },
        { new: true, runValidators: true }
      )
        .select('preferences')
        .lean()
        .exec();

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json(user.preferences);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour des préférences:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour des préférences' });
    }
  },

  async getNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const user = await User.findById(userId)
        .select('notifications')
        .lean()
        .exec();

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json(user.notifications || []);
    } catch (error) {
      logger.error('Erreur lors de la récupération des notifications:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
    }
  },

  async updateNotificationStatus(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { notificationId } = req.params;
      const { read } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const user = await User.findOneAndUpdate(
        { 
          _id: userId,
          'notifications.id': notificationId 
        },
        { 
          $set: { 'notifications.$.read': read }
        },
        { new: true }
      )
        .select('notifications')
        .lean()
        .exec();

      if (!user) {
        return res.status(404).json({ error: 'Notification non trouvée' });
      }

      res.json({ message: 'Statut de notification mis à jour avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut de notification:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de notification' });
    }
  }
}; 