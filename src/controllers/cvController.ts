import type { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { CV } from '../models/CV';
import { ValidatorFunction } from '../types/express-validator';

export const cvValidation: ValidatorFunction[] = [
  check('title').notEmpty().withMessage('Le titre est requis'),
  check('description').notEmpty().withMessage('La description est requise'),
  check('skills').isArray().withMessage('Les compétences doivent être une liste'),
  check('experience').isArray().withMessage('Les expériences doivent être une liste')
];

export const cvController = {
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const cv = new CV({
        ...req.body,
        user: req.user._id
      });
      await cv.save();
      res.status(201).json({
        success: true,
        data: cv
      });
    } catch (error) {
      console.error('Erreur lors de la création du CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du CV'
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const cv = await CV.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
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
      console.error('Erreur lors de la mise à jour du CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du CV'
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const cv = await CV.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
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
      console.error('Erreur lors de la suppression du CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du CV'
      });
    }
  },

  async getOne(req: Request, res: Response) {
    try {
      const cv = await CV.findOne({
        _id: req.params.id,
        user: req.user._id
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
      console.error('Erreur lors de la récupération du CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du CV'
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const cvs = await CV.find({ user: req.user._id });
      res.json({
        success: true,
        data: cvs
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des CVs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des CVs'
      });
    }
  }
}; 