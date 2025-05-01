import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

// Routes d'abonnement de base
router.get('/', protect, (req, res) => {
  res.status(200).json({ message: 'Get subscriptions route' });
});

router.post('/subscribe', protect, (req, res) => {
  res.status(200).json({ message: 'Subscribe route' });
});

export default router; 