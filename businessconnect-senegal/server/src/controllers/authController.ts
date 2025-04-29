import { Request, Response } from 'express';
import { authService } from '../services/authService';
import logger from '../utils/logger';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { fullName, email, phoneNumber, password } = req.body;

      // Validation des champs
      if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs sont requis'
        });
      }

      // Validation du format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Format d\'email invalide'
        });
      }

      // Validation du numéro de téléphone (format sénégalais)
      const phoneRegex = /^(70|75|76|77|78)[0-9]{7}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Format de numéro de téléphone invalide'
        });
      }

      // Validation du mot de passe
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe doit contenir au moins 8 caractères'
        });
      }

      const { user, token } = await authService.register({
        fullName,
        email,
        phoneNumber,
        password
      });

      logger.info(`Nouvel utilisateur enregistré: ${user.fullName}`);

      res.status(201).json({
        success: true,
        data: { user, token }
      });
    } catch (error) {
      logger.error('Erreur lors de l\'inscription:', error);
      
      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription'
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          message: 'Identifiant et mot de passe requis'
        });
      }

      const { user, token } = await authService.login(identifier, password);

      logger.info(`Connexion réussie: ${user.fullName}`);

      res.json({
        success: true,
        data: { user, token }
      });
    } catch (error) {
      logger.error('Erreur lors de la connexion:', error);
      
      res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }
  },

  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token non fourni'
        });
      }

      const user = await authService.verifyToken(token);

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification du token:', error);
      
      res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
  }
}; 