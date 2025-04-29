import express from 'express';
import { body } from 'express-validator';
import { jobController } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Routes publiques
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJob);
router.get('/categories', jobController.getCategories);

// Routes protégées
router.post(
  '/',
  authMiddleware,
  [
    body('title').not().isEmpty().withMessage('Le titre est requis'),
    body('description').not().isEmpty().withMessage('La description est requise'),
    body('company').not().isEmpty().withMessage('Le nom de l\'entreprise est requis'),
    body('location').not().isEmpty().withMessage('La localisation est requise'),
    body('type').isIn(['CDI', 'CDD', 'Stage', 'Freelance']).withMessage('Type de contrat invalide'),
  ],
  jobController.createJob
);

router.put('/:id', authMiddleware, jobController.updateJob);
router.delete('/:id', authMiddleware, jobController.deleteJob);

// Routes de candidature
router.post('/:id/apply', authMiddleware, jobController.applyToJob);
router.get('/applications/:jobId', authMiddleware, jobController.getJobApplications);
router.put('/applications/:applicationId', authMiddleware, jobController.updateApplicationStatus);

export default router; 