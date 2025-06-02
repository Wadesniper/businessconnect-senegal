import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { logger } from '../utils/logger';

// Type pour req.user
interface AuthRequest extends Request {
  user?: IUser;
}

export const userController = {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      });
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

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      });
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

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({ message: 'Profil supprimé avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la suppression du profil:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression du profil' });
    }
  }
}; 