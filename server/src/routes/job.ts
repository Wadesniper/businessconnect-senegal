import express from 'express';
import { body } from 'express-validator';
// import { jobController } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';
import { AuthRequest } from '../types/user';
import { Response } from 'express';
import { createJob } from '../controllers/jobController';
import { Router, RouteHandler, AuthRequestHandler } from '../types/express';
import * as jobController from '../controllers/jobController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJob);

// Routes authentifiées
router.use(authenticate);
router.post('/', jobController.createJob);

const getCategories: RouteHandler = async (req, res) => {
  const categories = await jobController.getCategories();
  res.json(categories);
};

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

router.get('/categories', getCategories);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);
router.post('/:id/apply', authMiddleware, applyForJob);
router.get('/applications/:jobId', authMiddleware, getApplications);
router.put('/applications/:applicationId', authMiddleware, updateApplication);

export default router; 