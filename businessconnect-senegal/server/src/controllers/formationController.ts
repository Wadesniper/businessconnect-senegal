import { Response } from 'express';
import FormationService from '../services/formationService';
import { logger } from '../utils/logger';
import { AuthenticatedRequest, ApiResponse, FormationRequest } from '../types/controllers';
import { Schema } from 'mongoose';

interface CursaFormation {
  url: string;
  categories: string[];
}

const CURSA_FORMATIONS: Record<string, CursaFormation> = {
  'developpement-web': {
    url: 'https://cursa.app/fr/formation/developpement-web',
    categories: ['Développement', 'Web']
  },
  'marketing-digital': {
    url: 'https://cursa.app/fr/formation/marketing-digital',
    categories: ['Marketing', 'Digital']
  },
  'design-ux': {
    url: 'https://cursa.app/fr/formation/design-ux',
    categories: ['Design', 'UX/UI']
  }
};

export class FormationController {
  private formationService: FormationService;

  constructor() {
    this.formationService = new FormationService();
  }

  getCursaFormations = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const { category } = req.query;
      let formations = CURSA_FORMATIONS;

      if (category) {
        formations = Object.fromEntries(
          Object.entries(CURSA_FORMATIONS).filter(([_, data]) =>
            data.categories.includes(category as string)
          )
        );
      }

      res.json({
        success: true,
        data: formations
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des formations Cursa:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des formations'
      });
    }
  };

  getCategories = async (_req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const categories = new Set<string>();
      Object.values(CURSA_FORMATIONS).forEach(data => {
        data.categories.forEach(cat => categories.add(cat));
      });

      res.json({
        success: true,
        data: Array.from(categories).sort()
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des catégories:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des catégories'
      });
    }
  };

  createFormation = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const formationData: FormationRequest = {
        ...req.body,
        instructor: new Schema.Types.ObjectId(userId)
      };

      const formation = await this.formationService.createFormation({
        ...formationData,
        createdBy: new Schema.Types.ObjectId(userId)
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
  };

  getFormationById = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const formation = await this.formationService.getFormationById(req.params.id);
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
  };

  updateFormation = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const formationData: Partial<FormationRequest> = req.body;
      const formation = await this.formationService.updateFormation(
        req.params.id,
        formationData,
        userId
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
  };

  deleteFormation = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const success = await this.formationService.deleteFormation(req.params.id, userId);
      if (!success) {
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
  };

  searchFormations = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Le terme de recherche est requis'
        });
      }

      const formations = await this.formationService.searchFormations(q as string);
      res.json({
        success: true,
        data: formations
      });
    } catch (error) {
      logger.error('Erreur lors de la recherche de formations:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche de formations'
      });
    }
  };

  enrollStudent = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const formationId = req.params.id;
      const result = await this.formationService.enrollStudent(formationId, userId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Formation non trouvée ou inscription impossible'
        });
      }

      res.json({
        success: true,
        message: 'Inscription réussie',
        data: result
      });
    } catch (error) {
      logger.error('Erreur lors de l\'inscription à la formation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription à la formation'
      });
    }
  };

  unenrollStudent = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const formationId = req.params.id;
      const result = await this.formationService.unenrollStudent(formationId, userId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Formation non trouvée ou désinscription impossible'
        });
      }

      res.json({
        success: true,
        message: 'Désinscription réussie'
      });
    } catch (error) {
      logger.error('Erreur lors de la désinscription de la formation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la désinscription de la formation'
      });
    }
  };

  rateFormation = async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const formationId = req.params.id;
      const { rating } = req.body;

      const result = await this.formationService.rateFormation(formationId, rating);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Formation non trouvée ou notation impossible'
        });
      }

      res.json({
        success: true,
        message: 'Notation enregistrée avec succès',
        data: result
      });
    } catch (error) {
      logger.error('Erreur lors de la notation de la formation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la notation de la formation'
      });
    }
  };
} 