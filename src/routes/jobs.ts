import express from 'express';
import { getAllJobs } from '../controllers/jobController';

const router = express.Router();

router.get('/api/jobs', getAllJobs);

export default router; 