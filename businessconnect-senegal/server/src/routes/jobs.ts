import { Router } from 'express';
// import { jobController } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Routes publiques
// router.get('/jobs', (req, res) => jobController.getAllJobs(req, res));
// router.get('/jobs/:id', (req, res) => jobController.getJob(req, res));
// router.get('/categories', (req, res) => jobController.getCategories(req, res));
// router.get('/search', (req, res) => jobController.searchJobs(req, res));

// Routes protégées
router.use(authMiddleware);
// router.post('/jobs', (req, res) => jobController.createJob(req, res));
// router.put('/jobs/:id', (req, res) => jobController.updateJob(req, res));
// router.delete('/jobs/:id', (req, res) => jobController.deleteJob(req, res));
// router.post('/jobs/:id/apply', (req, res) => jobController.applyToJob(req, res));

// Routes recruteur
// router.get('/employer/jobs', (req, res) => jobController.getEmployerJobs(req, res));
// router.get('/employer/applications', (req, res) => jobController.getJobApplications(req, res));
// router.put('/employer/applications/:id', (req, res) => jobController.updateApplicationStatus(req, res));

// Routes candidat
// router.get('/applications', (req, res) => jobController.getCandidateApplications(req, res));
// router.get('/saved-jobs', (req, res) => jobController.getSavedJobs(req, res));
// router.post('/jobs/:id/save', (req, res) => jobController.toggleSaveJob(req, res));

export default router; 