import { Request, Response, NextFunction } from 'express';
import { Formation } from '../models/formation';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { checkSubscription } from '../utils/subscriptionUtils';

export class FormationController {
  // Obtenir toutes les formations
  getAllFormations = catchAsync(async (req: Request, res: Response) => {
    const formations = await Formation.find();
    res.status(200).json({
      status: 'success',
      data: formations
    });
  });

  // Obtenir une formation par ID
  getFormation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const formation = await Formation.findById(req.params.id);
    
    if (!formation) {
      return next(new AppError('Formation non trouvée', 404));
    }

    res.status(200).json({
      status: 'success',
      data: formation
    });
  });

  // Accéder à une formation (vérification abonnement + redirection)
  accessFormation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id: formationId } = req.params;
    const userId = req.user?._id;

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
  addFormation = catchAsync(async (req: Request, res: Response) => {
    const formation = await Formation.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: formation
    });
  });
} 