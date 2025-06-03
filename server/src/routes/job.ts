import { Router } from 'express';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express';
import { jobController } from '../controllers/jobController';
import { authenticate } from '../middleware/auth';
import { Job } from '../models/Job';

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

const createJob = (req: Request, res: Response, next: NextFunction) => {
  jobController.createJob(req as AuthRequest, res).catch(next);
};

const updateJob = (req: Request, res: Response, next: NextFunction) => {
  jobController.updateJob(req as AuthRequest, res).catch(next);
};

const deleteJob = (req: Request, res: Response, next: NextFunction) => {
  jobController.deleteJob(req as AuthRequest, res).catch(next);
};

const applyForJob = (req: Request, res: Response, next: NextFunction) => {
  jobController.applyForJob(req as AuthRequest, res).catch(next);
};

const getMyApplications = (req: Request, res: Response, next: NextFunction) => {
  jobController.getMyApplications(req as AuthRequest, res).catch(next);
};

const getJobApplications = (req: Request, res: Response, next: NextFunction) => {
  jobController.getJobApplications(req as AuthRequest, res).catch(next);
};

const updateApplicationStatus = (req: Request, res: Response, next: NextFunction) => {
  jobController.updateApplicationStatus(req as AuthRequest, res).catch(next);
};

// Routes publiques
router.get('/categories', getCategories);
router.get('/search', searchJobs);
router.get('/:id', getJobById);
router.get('/', getAllJobs);

// Routes authentifiées
router.post('/', authenticate, createJob);
router.put('/:id', authenticate, updateJob);
router.delete('/:id', authenticate, deleteJob);
router.post('/:id/apply', authenticate, applyForJob);
router.get('/my-applications', authenticate, getMyApplications);
router.get('/:id/applications', authenticate, getJobApplications);
router.put('/:id/applications/:applicationId', authenticate, updateApplicationStatus);

export default router; 