import express from 'express';
import { body } from 'express-validator';
// import { jobController } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';
import { AuthRequest } from '../types/user';
import { Response } from 'express';
import { createJob } from '../controllers/jobController';
import { Router, RouteHandler, AuthRequestHandler } from '../types/express';
import { JobController } from '../controllers/jobController';

const router = Router();
const jobController = new JobController();

// Routes publiques
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  // await jobController.getAllJobs(req, res);
});

const getJob: RouteHandler = async (req, res) => {
  const job = await jobController.getJob(req.params.id);
  res.json(job);
};

const getCategories: RouteHandler = async (req, res) => {
  const categories = await jobController.getCategories();
  res.json(categories);
};

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
  createJob
);

const updateJob: AuthRequestHandler = async (req, res) => {
  const job = await jobController.updateJob(req.params.id, req.body);
  res.json(job);
};

const deleteJob: AuthRequestHandler = async (req, res) => {
  await jobController.deleteJob(req.params.id);
  res.json({ message: 'Job deleted successfully' });
};

// Routes de candidature
const applyForJob: AuthRequestHandler = async (req, res) => {
  const application = await jobController.applyForJob(req.params.id, req.body);
  res.json(application);
};

const getApplications: AuthRequestHandler = async (req, res) => {
  const applications = await jobController.getApplications(req.params.jobId);
  res.json(applications);
};

const updateApplication: AuthRequestHandler = async (req, res) => {
  const application = await jobController.updateApplication(req.params.applicationId, req.body);
  res.json(application);
};

router.get('/:id', getJob);
router.get('/categories', getCategories);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);
router.post('/:id/apply', authMiddleware, applyForJob);
router.get('/applications/:jobId', authMiddleware, getApplications);
router.put('/applications/:applicationId', authMiddleware, updateApplication);

export default router; 