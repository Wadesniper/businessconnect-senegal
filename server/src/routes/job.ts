import { Router, RequestHandler } from 'express';
import { Request, Response } from '../types/express';
import { jobController } from '../controllers/jobController';
import { authenticate } from '../middleware/auth';
import { Job } from '../models/Job';

const router = Router();

// Handlers
const getAllJobs: RequestHandler = (req, res, next) => {
  jobController.getAllJobs(req as Request, res as Response).catch(next);
};

const getJobById: RequestHandler = (req, res, next) => {
  jobController.getJobById(req as Request, res as Response).catch(next);
};

const searchJobs: RequestHandler = (req, res, next) => {
  jobController.searchJobs(req as Request, res as Response).catch(next);
};

const getCategories: RequestHandler = (req, res, next) => {
  Job.distinct('category')
    .then(categories => res.json(categories))
    .catch(err => {
      res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    });
};

const createJob: RequestHandler = (req, res, next) => {
  jobController.createJob(req as Request, res as Response).catch(next);
};

const updateJob: RequestHandler = (req, res, next) => {
  jobController.updateJob(req as Request, res as Response).catch(next);
};

const deleteJob: RequestHandler = (req, res, next) => {
  jobController.deleteJob(req as Request, res as Response).catch(next);
};

const applyForJob: RequestHandler = (req, res, next) => {
  jobController.applyForJob(req as Request, res as Response).catch(next);
};

const getMyApplications: RequestHandler = (req, res, next) => {
  jobController.getMyApplications(req as Request, res as Response).catch(next);
};

const getJobApplications: RequestHandler = (req, res, next) => {
  jobController.getJobApplications(req as Request, res as Response).catch(next);
};

const updateApplicationStatus: RequestHandler = (req, res, next) => {
  jobController.updateApplicationStatus(req as Request, res as Response).catch(next);
};

// Routes publiques
router.get('/categories', getCategories);
router.get('/search', searchJobs);
router.get('/:id', getJobById);
router.get('/', getAllJobs);

// Routes authentifiées
const authenticatedRouter = Router();
authenticatedRouter.use(authenticate);

authenticatedRouter.post('/', createJob);
authenticatedRouter.put('/:id', updateJob);
authenticatedRouter.delete('/:id', deleteJob);
authenticatedRouter.post('/:id/apply', applyForJob);
authenticatedRouter.get('/applications', getMyApplications);
authenticatedRouter.get('/:id/applications', getJobApplications);
authenticatedRouter.put('/:id/applications/:applicationId', updateApplicationStatus);

router.use('/', authenticatedRouter);

export default router; 