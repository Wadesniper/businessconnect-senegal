import express from 'express';
import { body } from 'express-validator';
import { jobController } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Routes publiques
router.get('/', async (req, res): Promise<void> => {
  await jobController.getAllJobs(req, res);
});
router.get('/:id', async (req, res): Promise<void> => {
  await jobController.getJob(req, res);
});
router.get('/categories', async (req, res): Promise<void> => {
  await jobController.getCategories(req, res);
});

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

router.put('/:id', authMiddleware, async (req, res): Promise<void> => {
  await jobController.updateJob(req, res);
});
router.delete('/:id', authMiddleware, async (req, res): Promise<void> => {
  await jobController.deleteJob(req, res);
});

// Routes de candidature
router.post('/:id/apply', authMiddleware, async (req, res): Promise<void> => {
  await jobController.applyToJob(req, res);
});
router.get('/applications/:jobId', authMiddleware, async (req, res): Promise<void> => {
  await jobController.getJobApplications(req, res);
});
router.put('/applications/:applicationId', authMiddleware, async (req, res): Promise<void> => {
  await jobController.updateApplicationStatus(req, res);
});

export default router; 