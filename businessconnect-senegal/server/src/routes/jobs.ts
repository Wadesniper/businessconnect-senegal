import { Router } from 'express';
import * as jobController from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireActiveSubscription } from '../middleware/requireActiveSubscription';

const router = Router();

router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.post('/', authMiddleware, requireActiveSubscription, jobController.createJob);
router.put('/:id', authMiddleware, requireActiveSubscription, jobController.updateJob);
router.delete('/:id', authMiddleware, requireActiveSubscription, jobController.deleteJob);

export default router; 