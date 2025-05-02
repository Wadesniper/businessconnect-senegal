import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

// Routes de paiement de base
router.post('/initiate', protect, (req, res) => {
  res.status(200).json({ message: 'Payment initiation route' });
});

router.post('/webhook', (req, res) => {
  res.status(200).json({ message: 'Payment webhook route' });
});

export default router; 