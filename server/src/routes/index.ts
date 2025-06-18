import { Router } from 'express';
import healthRoutes from './health.js';
import userRoutes from './users.js';
import jobRoutes from './job.js';
import marketplaceRoutes from './marketplace.js';
import notificationRoutes from './notifications.js';
import contactRoutes from './contactRoutes.js';
import subscriptionRoutes from './subscriptions.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { uploadToSupabaseStorage } from '../services/supabaseStorageService.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/contact', contactRoutes);
router.use('/subscriptions', subscriptionRoutes);

// Route d'upload d'image (pour la marketplace)
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier reçu' });
  }
  try {
    const url = await uploadToSupabaseStorage(req.file);
    res.json({ url });
  } catch (e) {
    res.status(500).json({ error: 'Erreur upload Supabase', details: (e as Error).message });
  }
});

export default router; 