import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { CV } from '../models/cv';
import { ValidatorFunction } from '../types/express-validator';
import { logger } from '../utils/logger';

export const cvValidation: ValidatorFunction[] = [
  check('title').notEmpty().withMessage('Le titre est requis'),
  check('description').notEmpty().withMessage('La description est requise'),
  check('skills').isArray().withMessage('Les compétences doivent être une liste'),
  check('experience').isArray().withMessage('Les expériences doivent être une liste')
];

export const cvController = {
  createCV: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      const cvData = {
        ...req.body,
        user: req.user.id
      };

      const cv = await CV.create(cvData);

      res.status(201).json({
        success: true,
        data: cv
      });
    } catch (error) {
      logger.error('Erreur lors de la création du CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du CV'
      });
    }
  },

  updateCV: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      const cv = await CV.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        { new: true }
      );

      if (!cv) {
        return res.status(404).json({
          success: false,
          message: 'CV non trouvé'
        });
      }

      res.json({
        success: true,
        data: cv
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du CV'
      });
    }
  },

  deleteCV: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      const cv = await CV.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
      });

      if (!cv) {
        return res.status(404).json({
          success: false,
          message: 'CV non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'CV supprimé avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression du CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du CV'
      });
    }
  },

  getCV: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      const cv = await CV.findOne({
        _id: req.params.id,
        user: req.user.id
      });

      if (!cv) {
        return res.status(404).json({
          success: false,
          message: 'CV non trouvé'
        });
      }

      res.json({
        success: true,
        data: cv
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération du CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du CV'
      });
    }
  },

  getAllCVs: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      const cvs = await CV.find({ user: req.user.id });

      res.json({
        success: true,
        data: cvs
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des CVs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des CVs'
      });
    }
  }
}; 