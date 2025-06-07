import { Router } from 'express';
import { FormationController } from '../controllers/formationController.js';

const router = Router();
const formationController = new FormationController();

// Route pour obtenir les formations Cursa selon le domaine
router.get('/cursa', formationController.getCursaFormations);

// Route pour obtenir les catégories de formations Cursa
router.get('/categories', formationController.getCategories);

export default router; 