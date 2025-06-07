import { Router } from 'express';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express.js';
import { jobController } from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';
import { Job } from '../models/Job.js';

const router = Router();

// Handlers avec typage explicite des paramètres
const getAllJobs = (req: Request, res: Response, next: NextFunction) => {
  jobController.getAllJobs(req, res).catch(next);
};

const getJobById = (req: Request, res: Response, next: NextFunction) => {
  jobController.getJobById(req, res).catch(next);
};

const searchJobs = (req: Request, res: Response, next: NextFunction) => {
  jobController.searchJobs(req, res).catch(next);
};

const getCategories = (req: Request, res: Response, next: NextFunction) => {
  Job.distinct('category')
    .then(categories => res.json(categories))
    .catch(err => {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    });
};

// Routes publiques
router.get('/categories', getCategories);
router.get('/search', searchJobs);
router.get('/:id', getJobById);
router.get('/', getAllJobs);

// Routes authentifiées
router.post('/', authenticate, (req: AuthRequest, res: Response, next: NextFunction) => jobController.createJob(req, res).catch(next));
router.put('/:id', authenticate, (req: AuthRequest, res: Response, next: NextFunction) => jobController.updateJob(req, res).catch(next));
router.delete('/:id', authenticate, (req: AuthRequest, res: Response, next: NextFunction) => jobController.deleteJob(req, res).catch(next));
router.post('/:id/apply', authenticate, (req: AuthRequest, res: Response, next: NextFunction) => jobController.applyForJob(req, res).catch(next));
router.get('/my-applications', authenticate, (req: AuthRequest, res: Response, next: NextFunction) => jobController.getMyApplications(req, res).catch(next));
router.get('/:id/applications', authenticate, (req: AuthRequest, res: Response, next: NextFunction) => jobController.getJobApplications(req, res).catch(next));
router.put('/:id/applications/:applicationId', authenticate, (req: AuthRequest, res: Response, next: NextFunction) => jobController.updateApplicationStatus(req, res).catch(next));

export default router; 