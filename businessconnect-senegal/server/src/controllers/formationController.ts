import { Request, Response } from 'express';
import { FormationService } from '../services/formationService';
import { logger } from '../utils/logger';
import { AuthRequest } from '../types/user';

interface CursaFormation {
  url: string;
  categories: string[];
}

interface CursaFormations {
  informatique: CursaFormation;
  langues: CursaFormation;
  gestion: CursaFormation;
  pro: CursaFormation;
  art: CursaFormation;
  education: CursaFormation;
  esthetique: CursaFormation;
  sante: CursaFormation;
}

const CURSA_FORMATIONS: CursaFormations = {
  informatique: {
    url: 'https://cursa.app/cours-online-linformatique-gratuits',
    categories: ['Programmation web', 'IA', 'Bases de données', 'Développement mobile', 'Cybersécurité']
  },
  langues: {
    url: 'https://cursa.app/cours-online-langues-et-communication-gratuits',
    categories: ['Anglais', 'Espagnol', 'Français', 'Chinois', 'Japonais']
  },
  gestion: {
    url: 'https://cursa.app/cours-online-gestion-et-affaires-gratuits',
    categories: ['Marketing', 'Finance', 'Entrepreneuriat', 'Management', 'Comptabilité']
  },
  pro: {
    url: 'https://cursa.app/cours-online-professionnaliser-gratuits',
    categories: ['Immobilier', 'Automobile', 'Sécurité', 'Construction', 'Services']
  },
  art: {
    url: 'https://cursa.app/cours-online-art-et-design-gratuits',
    categories: ['Graphisme', 'UX/UI', '3D', 'Animation', 'Vidéo']
  },
  education: {
    url: 'https://cursa.app/cours-online-education-de-base-gratuits',
    categories: ['Mathématiques', 'Sciences', 'Histoire', 'Philosophie', 'Littérature']
  },
  esthetique: {
    url: 'https://cursa.app/cours-online-esthetique-gratuits',
    categories: ['Maquillage', 'Soins', 'Coiffure']
  },
  sante: {
    url: 'https://cursa.app/cours-online-sante-gratuits',
    categories: ['Soins', 'Nutrition', 'Psychologie', 'Premiers secours']
  }
};

export class FormationController {
  private formationService: FormationService;

  constructor() {
    this.formationService = new FormationService();
  }

  // Obtenir toutes les formations externes (Cursa)
  getCursaFormations = async (req: Request, res: Response) => {
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

  // Obtenir toutes les catégories de formations
  getCategories = async (req: Request, res: Response) => {
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

  // Obtenir les formations internes
  getAllFormations = async (req: Request, res: Response) => {
    try {
      const { category, level, featured } = req.query;
      const formations = await this.formationService.getAllFormations({
        category: category as string,
        level: level as string,
        featured: featured === 'true'
      });

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
  };

  // Obtenir une formation par son ID
  getFormationById = async (req: Request, res: Response) => {
    try {
      const formation = await this.formationService.getFormationById(req.params.id);
      res.json({
        success: true,
        data: formation
      });
    } catch (error) {
      logger.error(`Erreur lors de la récupération de la formation ${req.params.id}:`, error);
      res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
  };

  // Créer une nouvelle formation
  createFormation = async (req: AuthRequest, res: Response) => {
    try {
      const formationData = {
        ...req.body,
        instructor: req.user?.id
      };

      const formation = await this.formationService.createFormation(formationData);
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

  // Mettre à jour une formation
  updateFormation = async (req: Request, res: Response) => {
    try {
      const formation = await this.formationService.updateFormation(req.params.id, req.body);
      res.json({
        success: true,
        data: formation
      });
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour de la formation ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la formation'
      });
    }
  };

  // Supprimer une formation
  deleteFormation = async (req: Request, res: Response) => {
    try {
      await this.formationService.deleteFormation(req.params.id);
      res.json({
        success: true,
        message: 'Formation supprimée avec succès'
      });
    } catch (error) {
      logger.error(`Erreur lors de la suppression de la formation ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la formation'
      });
    }
  };

  // Inscrire un étudiant à une formation
  enrollStudent = async (req: AuthRequest, res: Response) => {
    try {
      const formation = await this.formationService.enrollStudent(
        req.params.id,
        req.user?.id as string
      );
      res.json({
        success: true,
        data: formation
      });
    } catch (error) {
      logger.error('Erreur lors de l\'inscription à la formation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription à la formation'
      });
    }
  };

  // Désinscrire un étudiant d'une formation
  unenrollStudent = async (req: AuthRequest, res: Response) => {
    try {
      const formation = await this.formationService.unenrollStudent(
        req.params.id,
        req.user?.id as string
      );
      res.json({
        success: true,
        data: formation
      });
    } catch (error) {
      logger.error('Erreur lors de la désinscription de la formation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la désinscription de la formation'
      });
    }
  };

  // Noter une formation
  rateFormation = async (req: Request, res: Response) => {
    try {
      const { rating } = req.body;
      if (rating < 0 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'La note doit être comprise entre 0 et 5'
        });
      }

      const formation = await this.formationService.rateFormation(req.params.id, rating);
      res.json({
        success: true,
        data: formation
      });
    } catch (error) {
      logger.error('Erreur lors de l\'évaluation de la formation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'évaluation de la formation'
      });
    }
  };

  // Rechercher des formations
  searchFormations = async (req: Request, res: Response) => {
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
} 