import express from 'express';
import { jobController } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Routes publiques
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

// Routes protégées
router.use(authMiddleware);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

export default router; 