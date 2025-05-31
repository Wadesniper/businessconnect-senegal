import { Request, Response } from 'express';
import { User, IUser, IUserBase } from '../models/User';
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
      role: 'etudiant' | 'annonceur' | 'employeur' | 'admin';
    };
  }
}

// Type pour req.user
type AuthRequest = Request;

// Type pour les mises à jour autorisées
type AllowedUpdates = Partial<IUserBase>;

export const userController = {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const user = await User.findById(userId)
        .select('-password -verificationToken -resetPasswordToken -resetPasswordExpires')
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

      const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'preferences'] as const;
      const updates = Object.keys(req.body).reduce((acc: AllowedUpdates, key) => {
        if (allowedFields.includes(key as keyof AllowedUpdates)) {
          if (key === 'preferences') {
            acc.preferences = {
              ...req.body.preferences
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
          select: '-password -verificationToken -resetPasswordToken -resetPasswordExpires'
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
  }
}; 