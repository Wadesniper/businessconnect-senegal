import { Request, Response, NextFunction } from 'express';
import { Formation } from '../models/formation';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { checkSubscription } from '../utils/subscriptionUtils';
import { logger } from '../utils/logger';

export class FormationController {
  // Obtenir toutes les formations
  async getFormations(req: Request, res: Response) {
    try {
      const formations = await Formation.find();
      res.json({
        success: true,
        data: formations
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des formations:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des formations'
      });
    }
  }

  // Obtenir une formation par ID
  async getFormationById(req: Request, res: Response) {
    try {
      const formation = await Formation.findById(req.params.id);
      if (!formation) {
        return res.status(404).json({
          success: false,
          message: 'Formation non trouvée'
        });
      }
      res.json({
        success: true,
        data: formation
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de la formation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la formation'
      });
    }
  }

  // Accéder à une formation (vérification abonnement + redirection)
  accessFormation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id: formationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('Utilisateur non authentifié', 401));
    }

    // Vérifier l'abonnement
    const hasValidSubscription = await checkSubscription(userId);
    if (!hasValidSubscription) {
      return next(new AppError('Accès non autorisé - Abonnement requis', 403));
    }

    // Récupérer l'URL de la formation
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return next(new AppError('Formation non trouvée', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        redirectUrl: formation.cursaUrl
      }
    });
  });

  // Obtenir les formations par catégorie
  getFormationsByCategory = catchAsync(async (req: Request, res: Response) => {
    const { category } = req.params;
    const formations = await Formation.find({ category });

    res.status(200).json({
      status: 'success',
      data: formations
    });
  });

  // Ajouter une nouvelle formation (admin seulement)
  async createFormation(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      const formation = await Formation.create({
        ...req.body,
        createdBy: req.user.id
      });

      res.status(201).json({
        success: true,
        data: formation
      });
    } catch (error) {
      logger.error('Erreur lors de la création de la formation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la formation'
      });
    }
  }

  async updateFormation(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      const formation = await Formation.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.id },
        req.body,
        { new: true }
      );

      if (!formation) {
        return res.status(404).json({
          success: false,
          message: 'Formation non trouvée'
        });
      }

      res.json({
        success: true,
        data: formation
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de la formation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la formation'
      });
    }
  }

  async deleteFormation(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      const formation = await Formation.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user.id
      });

      if (!formation) {
        return res.status(404).json({
          success: false,
          message: 'Formation non trouvée'
        });
      }

      res.json({
        success: true,
        message: 'Formation supprimée avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression de la formation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la formation'
      });
    }
  }
} 