import express from 'express';
import { adController } from '../controllers/adController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Routes publiques
router.get('/', adController.getAllAds);
router.get('/:id', adController.getAdById);

// Routes protégées
router.use(authMiddleware);
router.post('/', adController.createAd);
router.put('/:id', adController.updateAd);
router.delete('/:id', adController.deleteAd);

export default router; 