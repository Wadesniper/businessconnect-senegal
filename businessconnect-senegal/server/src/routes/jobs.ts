import { Router } from 'express';
import * as jobController from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.post('/', authMiddleware, jobController.createJob);
router.put('/:id', authMiddleware, jobController.updateJob);
router.delete('/:id', authMiddleware, jobController.deleteJob);

export default router; 