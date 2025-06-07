import { Request, Response, AuthRequest } from '../types/custom.express.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import { CV } from '../models/cv.js';
import { StorageService } from '../services/storageService.js';
import { pdfService } from '../services/pdfService.js';
import { CVService } from '../services/cvService.js';
import { body, validationResult } from 'express-validator';

export class CVController {
  private cvService: CVService;

  constructor() {
    this.cvService = new CVService();
  }

  createCV = async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const cv = await this.cvService.createCV(userId, req.body);
      return res.status(201).json({ success: true, data: cv });
    } catch (error) {
      logger.error('Erreur lors de la création du CV:', error);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  updateCV = async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const cv = await this.cvService.updateCV(req.params.id, userId, req.body);
      if (!cv) {
        return res.status(404).json({ success: false, message: 'CV non trouvé' });
      }

      return res.status(200).json({ success: true, data: cv });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du CV:', error);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  getCV = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const cv = await this.cvService.getCV(req.params.id, userId);
      if (!cv) {
        return res.status(404).json({ success: false, message: 'CV non trouvé' });
      }

      return res.status(200).json({ success: true, data: cv });
    } catch (error) {
      logger.error('Erreur lors de la récupération du CV:', error);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  getUserCVs = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const cvs = await this.cvService.getUserCVs(userId);
      return res.status(200).json({ success: true, data: cvs });
    } catch (error) {
      logger.error('Erreur lors de la récupération des CVs:', error);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  deleteCV = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const success = await this.cvService.deleteCV(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ success: false, message: 'CV non trouvé' });
      }

      return res.status(200).json({ success: true, message: 'CV supprimé' });
    } catch (error) {
      logger.error('Erreur lors de la suppression du CV:', error);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  generatePDF = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const pdfUrl = await this.cvService.generatePDF(req.params.id, userId);
      return res.status(200).json({ success: true, data: { pdfUrl } });
    } catch (error) {
      logger.error('Erreur lors de la génération du PDF:', error);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };
}

export const cvValidation = {
  createCV: [
    body('template')
      .isIn(['modern', 'classic', 'creative', 'professional'])
      .withMessage('Template invalide'),
    body('personalInfo.firstName')
      .trim()
      .notEmpty()
      .withMessage('Le prénom est requis'),
    body('personalInfo.lastName')
      .trim()
      .notEmpty()
      .withMessage('Le nom est requis'),
    body('personalInfo.email')
      .trim()
      .isEmail()
      .withMessage('Email invalide'),
    body('education.*.school')
      .trim()
      .notEmpty()
      .withMessage('Le nom de l\'école est requis'),
    body('education.*.degree')
      .trim()
      .notEmpty()
      .withMessage('Le diplôme est requis'),
    body('education.*.startDate')
      .isISO8601()
      .withMessage('Date de début invalide'),
    body('experience.*.company')
      .trim()
      .notEmpty()
      .withMessage('Le nom de l\'entreprise est requis'),
    body('experience.*.position')
      .trim()
      .notEmpty()
      .withMessage('Le poste est requis'),
    body('experience.*.startDate')
      .isISO8601()
      .withMessage('Date de début invalide'),
    body('skills.*.name')
      .trim()
      .notEmpty()
      .withMessage('Le nom de la compétence est requis'),
    body('skills.*.level')
      .isIn(['débutant', 'intermédiaire', 'avancé', 'expert'])
      .withMessage('Niveau de compétence invalide'),
    body('skills.*.category')
      .isIn(['technique', 'soft', 'langue'])
      .withMessage('Catégorie de compétence invalide')
  ],
  updateCV: [
    body('template')
      .optional()
      .isIn(['modern', 'classic', 'creative', 'professional'])
      .withMessage('Template invalide'),
    body('personalInfo.firstName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Le prénom est requis'),
    body('personalInfo.lastName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Le nom est requis'),
    body('personalInfo.email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Email invalide')
  ]
}; 