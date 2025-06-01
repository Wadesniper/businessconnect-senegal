import express from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import subscriptionRoutes from './subscriptions';
import webhookRoutes from './webhook';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Routes publiques
router.use('/auth', authRoutes);
router.use('/webhook', webhookRoutes);

// Routes protégées
router.use(authenticate);
router.use('/users', userRoutes);
router.use('/subscriptions', subscriptionRoutes);

export default router; 