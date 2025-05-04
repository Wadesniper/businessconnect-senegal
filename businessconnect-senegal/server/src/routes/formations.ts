import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authMiddleware } from '../middleware/authMiddleware';
import { FormationController } from '../controllers/formationController';

const router = express.Router();
const formationController = new FormationController();

// Routes publiques
router.get('/cursa', formationController.getCursaFormations);
router.get('/categories', formationController.getCategories);
router.get('/search', formationController.searchFormations);
router.get('/', formationController.searchFormations);
router.get('/:id', formationController.getFormationById);

// Routes protégées
router.use(authMiddleware);

// Création d'une formation
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Le titre est requis'),
    body('description').trim().notEmpty().withMessage('La description est requise'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('La catégorie est requise')
      .isIn(['développement', 'business', 'marketing', 'design', 'langues', 'soft-skills'])
      .withMessage('Catégorie invalide'),
    body('level')
      .trim()
      .notEmpty()
      .withMessage('Le niveau est requis')
      .isIn(['débutant', 'intermédiaire', 'avancé'])
      .withMessage('Niveau invalide'),
    body('duration')
      .isInt({ min: 1 })
      .withMessage('La durée doit être un nombre positif'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Le prix doit être un nombre positif'),
    body('thumbnail')
      .trim()
      .notEmpty()
      .withMessage('L\'image est requise'),
  ],
  validateRequest,
  formationController.createFormation
);

// Mise à jour d'une formation
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Le titre ne peut pas être vide'),
    body('description').optional().trim().notEmpty().withMessage('La description ne peut pas être vide'),
    body('category')
      .optional()
      .trim()
      .notEmpty()
      .isIn(['développement', 'business', 'marketing', 'design', 'langues', 'soft-skills'])
      .withMessage('Catégorie invalide'),
    body('level')
      .optional()
      .trim()
      .notEmpty()
      .isIn(['débutant', 'intermédiaire', 'avancé'])
      .withMessage('Niveau invalide'),
    body('duration')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La durée doit être un nombre positif'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Le prix doit être un nombre positif'),
  ],
  validateRequest,
  formationController.updateFormation
);

// Suppression d'une formation
router.delete('/:id', formationController.deleteFormation);

// Inscription à une formation
router.post('/:id/enroll', formationController.enrollStudent);

// Désinscription d'une formation
router.post('/:id/unenroll', formationController.unenrollStudent);

// Noter une formation
router.post(
  '/:id/rate',
  [
    body('rating')
      .isFloat({ min: 0, max: 5 })
      .withMessage('La note doit être comprise entre 0 et 5'),
  ],
  validateRequest,
  formationController.rateFormation
);

export default router; 