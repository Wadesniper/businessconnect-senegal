import { Router } from 'express';
import healthRoutes from './health.js';
import userRoutes from './users.js';
import jobRoutes from './job.js';
import marketplaceRoutes from './marketplace.js';
import notificationRoutes from './notifications.js';
import contactRoutes from './contactRoutes.js';
import subscriptionRoutes from './subscriptions.js';
import { getUploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/contact', contactRoutes);
router.use('/subscriptions', subscriptionRoutes);

// Route d'upload d'image (pour la marketplace)
router.post('/upload', async (req, res, next) => {
  const upload = await getUploadMiddleware();
  upload.single('file')(req, res, function (err: any) {
    if (err) return next(err);
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier reçu' });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

export default router; 