import { Router } from 'express';
import userRoutes from './users';
import jobRoutes from './job';
import marketplaceRoutes from './marketplace';
import notificationRoutes from './notifications';
import contactRoutes from './contactRoutes';
import paymentRoutes from './paymentRoutes';
import subscriptionRoutes from './subscriptions';

const router = Router();

router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/contact', contactRoutes);
router.use('/payments', paymentRoutes);
router.use('/subscriptions', subscriptionRoutes);

export default router; 