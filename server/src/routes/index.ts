import { Router } from 'express';
import healthRoutes from './health.js';
import userRoutes from './users.js';
import jobRoutes from './job.js';
import marketplaceRoutes from './marketplace.js';
import notificationRoutes from './notifications.js';
import contactRoutes from './contactRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import subscriptionRoutes from './subscriptions.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/contact', contactRoutes);
router.use('/payment', paymentRoutes);
router.use('/subscriptions', subscriptionRoutes);

export default router; 