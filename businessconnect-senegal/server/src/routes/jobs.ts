import { Router } from 'express';
import { jobController } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Routes publiques
router.get('/jobs', jobController.getAllJobs);
router.get('/jobs/:id', jobController.getJob);
router.get('/categories', jobController.getCategories);
router.get('/search', jobController.searchJobs);

// Routes protégées
router.use(authMiddleware);
router.post('/jobs', jobController.createJob);
router.put('/jobs/:id', jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);
router.post('/jobs/:id/apply', jobController.applyToJob);

// Routes recruteur
router.get('/employer/jobs', jobController.getEmployerJobs);
router.get('/employer/applications', jobController.getJobApplications);
router.put('/employer/applications/:id', jobController.updateApplicationStatus);

// Routes candidat
router.get('/applications', jobController.getCandidateApplications);
router.get('/saved-jobs', jobController.getSavedJobs);
router.post('/jobs/:id/save', jobController.toggleSaveJob);

export default router; 