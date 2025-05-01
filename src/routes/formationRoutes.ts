import express from 'express';
import { FormationController } from '../controllers/formationController';
import { protect } from '../middleware/auth';
import { restrictTo } from '../middleware/restrictTo';

const router = express.Router();
const formationController = new FormationController();

// Routes publiques
router.get('/', formationController.getAllFormations);
router.get('/:id', formationController.getFormation);
router.get('/category/:category', formationController.getFormationsByCategory);

// Routes protégées (nécessitent une authentification)
router.use(protect);
router.get('/:id/access', formationController.accessFormation);

// Routes admin
router.use(restrictTo('admin'));
router.post('/', formationController.addFormation);

export default router; 