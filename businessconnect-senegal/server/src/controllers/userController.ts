import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { query } from '../config/database';

interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  name: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
}

function normalizePhone(phone: string): string | null {
  // Nettoyer la saisie
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  // Numéro local sénégalais : 9 chiffres, commence par 7
  if (/^7\d{8}$/.test(cleaned)) {
    return '+221' + cleaned;
  }
  // Sinon, on refuse
  return null;
}

export const userController = {
  async register(req: Request, res: Response) {
    try {
      const { name, phone, password, email } = req.body;
      const normalizedPhone = normalizePhone(phone);
      if (!normalizedPhone) {
        return res.status(400).json({
          status: 'error',
          message: 'Merci d’entrer votre numéro au format international (+221786049485 ou +33612345678).'
        });
      }
      // Vérifier si l'utilisateur existe déjà par téléphone
      const existingUser = await query('SELECT * FROM users WHERE phone = $1', [normalizedPhone]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Un utilisateur avec ce numéro de téléphone existe déjà'
        });
      }
      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // Créer l'utilisateur
      const result = await query(
        'INSERT INTO users (name, phone, password, email, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, phone, email, role',
        [name, normalizedPhone, hashedPassword, email || null, 'user']
      );
      const user = result.rows[0];
      // Générer le token JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '24h' }
      );
      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      logger.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de l\'inscription'
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { phone, password } = req.body;
      const normalizedPhone = normalizePhone(phone);
      if (!normalizedPhone) {
        return res.status(400).json({
          status: 'error',
          message: 'Merci d’entrer votre numéro au format international (+221786049485 ou +33612345678).'
        });
      }
      // Vérifier si l'utilisateur existe par téléphone
      const result = await query('SELECT * FROM users WHERE phone = $1', [normalizedPhone]);
      if (result.rows.length === 0) {
        return res.status(401).json({
          status: 'error',
          message: 'Numéro de téléphone ou mot de passe incorrect'
        });
      }
      const user = result.rows[0] as User;
      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Numéro de téléphone ou mot de passe incorrect'
        });
      }
      // Générer le token JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '24h' }
      );
      res.json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la connexion'
      });
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const result = await query(
        'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        status: 'success',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la récupération du profil'
      });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { name, email } = req.body;

      const result = await query(
        'UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, name, role',
        [name, email, userId]
      );

      res.json({
        status: 'success',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la mise à jour du profil'
      });
    }
  },

  async updatePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { currentPassword, newPassword } = req.body;

      // Vérifier le mot de passe actuel
      const user = await query('SELECT * FROM users WHERE id = $1', [userId]);
      const isValidPassword = await bcrypt.compare(currentPassword, user.rows[0].password);

      if (!isValidPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Mot de passe actuel incorrect'
        });
      }

      // Hasher le nouveau mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Mettre à jour le mot de passe
      await query(
        'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [hashedPassword, userId]
      );

      res.json({
        status: 'success',
        message: 'Mot de passe mis à jour avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du mot de passe:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la mise à jour du mot de passe'
      });
    }
  },

  async deleteAccount(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      await query('DELETE FROM users WHERE id = $1', [userId]);

      res.json({
        status: 'success',
        message: 'Compte supprimé avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression du compte:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la suppression du compte'
      });
    }
  },

  // Méthodes administrateur
  async getAllUsers(req: Request, res: Response) {
    try {
      const result = await query(
        'SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY created_at DESC'
      );

      res.json({
        status: 'success',
        data: result.rows
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la récupération des utilisateurs'
      });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      const result = await query(
        'UPDATE users SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, email, name, role',
        [name, email, role, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        status: 'success',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la mise à jour de l\'utilisateur'
      });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        status: 'success',
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la suppression de l\'utilisateur'
      });
    }
  }
}; 